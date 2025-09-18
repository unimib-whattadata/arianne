import {
  chats,
  ChatsAddMessageSchema,
  ChatsGetOrCreateSchema,
  messages,
} from "@arianne/db/schemas/chats";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import Redis from "ioredis";
import { z } from "zod";

import { cache, publisher } from "../redis";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export type Message = {
  sender: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    roles: string[];
    phone: string | null;
    address: string | null;
    group: string[];
  };
} & {
  chatId: string;
  content: string;
  senderType: "patient" | "therapist";
  id: string;
  createdAt: Date;
  updatedAt: Date;
  index: number;
  initials: string;
  senderId: string;
};

export interface Status {
  userId: string;
  chatId?: string;
  status: "online" | "offline" | "isTyping";
}

const STATUS_CHANNEL = "user:presence";
const ONLINE_USERS_KEY = "online_users";

async function* createRedisSubscription<T>(
  channel: string,
  parser: (rawMessage: string) => T,
) {
  if (!process.env.REDIS) {
    throw new TRPCError({
      message: `Error creating Redis subscription: REDIS env var not set`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const subscriber = new Redis(process.env.REDIS);

  subscriber.on("error", (err) => {
    throw new TRPCError({
      message: `Error with Redis subscription: ${err.message}`,
      code: "INTERNAL_SERVER_ERROR",
      cause: err,
    });
  });

  let resolveNext: ((value: T | PromiseLike<T>) => void) | null = null;
  let nextPromise = new Promise<T>((resolve) => {
    resolveNext = resolve;
  });

  const messageHandler = (ch: string, rawMessage: string) => {
    if (ch === channel) {
      try {
        const data = parser(rawMessage);
        if (resolveNext) {
          resolveNext(data);
          nextPromise = new Promise<T>((resolve) => {
            resolveNext = resolve;
          });
        }
      } catch (parseError) {
        console.error(
          `Error parsing message from Redis channel ${channel}:`,
          parseError,
        );
      }
    }
  };

  subscriber.on("message", messageHandler);

  try {
    await subscriber.subscribe(channel);
    while (true) {
      yield await nextPromise;
    }
  } catch (err) {
    throw new Error(
      `Subscription error on channel ${channel}: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    subscriber.off("message", messageHandler);
    try {
      await subscriber.unsubscribe(channel);
    } catch (err) {
      console.error(`Error unsubscribing from ${channel}:`, err);
    }
    try {
      await subscriber.quit();
    } catch (err) {
      console.error("Error quitting Redis subscriber:", err);
    }
  }
}

export const chatsRouter = createTRPCRouter({
  getOrCreate: protectedProcedure
    .input(ChatsGetOrCreateSchema)
    .query(async ({ input, ctx }) => {
      const chat = await ctx.db.query.chats.findFirst({
        where: (chats, { eq }) =>
          and(
            eq(chats.patientProfileId, input.patientProfileId),
            eq(chats.therapistProfileId, input.therapistProfileId),
          ),
        with: {
          messages: {
            orderBy: (messages, { asc }) => asc(messages.index),
          },
        },
      });

      if (!chat) {
        const newChat = await ctx.db
          .insert(chats)
          .values({
            patientProfileId: input.patientProfileId,
            therapistProfileId: input.therapistProfileId,
            lastIndex: 0,
          })
          .returning()
          .then((result) => result[0]!); // Return the newly created chat

        const messages = await ctx.db.query.messages.findMany({
          where: (messages, { eq }) => eq(messages.chatId, newChat.id),
        });

        return {
          ...newChat,
          messages,
        };
      }

      return chat;
    }),

  addMessage: protectedProcedure
    .input(ChatsAddMessageSchema)
    .mutation(async ({ input, ctx }) => {
      const chat = await ctx.db.query.chats.findFirst({
        where: (chats, { eq }) =>
          and(
            eq(chats.patientProfileId, input.patientProfileId),
            eq(chats.therapistProfileId, input.therapistProfileId),
          ),
      });

      if (!chat) {
        throw new TRPCError({ message: "Chat Not Found", code: "NOT_FOUND" });
      }

      const newIndex = chat.lastIndex + 1;
      const senderName =
        ctx.user.firstName.at(0)!.toUpperCase() +
        ctx.user.lastName.at(0)!.toUpperCase();

      const message = await ctx.db
        .insert(messages)
        .values({
          chatId: chat.id,
          content: input.content,
          senderId: ctx.user.id,
          senderType: input.senderType,
          index: newIndex,
          initials: senderName,
        })
        .returning()
        .then((res) => res[0]!);

      await ctx.db
        .update(chats)
        .set({ lastIndex: newIndex })
        .where(eq(chats.id, chat.id));

      const publisher = new Redis(process.env.REDIS!);

      await publisher.publish(
        `chat:${input.patientProfileId}:${input.therapistProfileId}`,
        JSON.stringify(message),
      );

      return message;
    }),

  onAdd: protectedProcedure
    .input(ChatsGetOrCreateSchema)
    .subscription(({ input }) => {
      return createRedisSubscription<Message>(
        `chat:${input.patientProfileId}:${input.therapistProfileId}`,
        (rawMessage) => {
          return JSON.parse(rawMessage) as Message;
        },
      );
    }),

  setUserOnline: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userChatKey = `${ctx.user.id}`;
    await cache.sadd(ONLINE_USERS_KEY, userChatKey);

    const status: Status = {
      userId: ctx.user.id,
      status: "online",
    };

    await publisher.publish(STATUS_CHANNEL, JSON.stringify(status));

    return { success: true };
  }),

  setUserOffline: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userChatKey = `${ctx.user.id}`;
    await cache.srem(ONLINE_USERS_KEY, userChatKey);

    const status: Status = {
      userId: userId,
      status: "offline",
    };

    await publisher.publish(STATUS_CHANNEL, JSON.stringify(status));

    return { success: true };
  }),

  isUserOnline: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const userChatKey = `${input.userId}`;
      const isOnline = await cache.sismember(ONLINE_USERS_KEY, userChatKey);

      return isOnline === 1;
    }),

  setUserTyping: protectedProcedure
    .input(
      z.object({
        typingStatus: z.enum(["isTyping", "stoppedTyping"]),
        patientProfileId: z.string(),
        therapistProfileId: z.string(),
        sender: z.enum(["patient", "therapist"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const status: Status = {
        userId:
          input.sender === "patient"
            ? input.patientProfileId
            : input.therapistProfileId,
        chatId: `${input.patientProfileId}:${input.therapistProfileId}`,
        status: input.typingStatus === "isTyping" ? "isTyping" : "online",
      };

      await publisher.publish(STATUS_CHANNEL, JSON.stringify(status));

      return { success: true };
    }),

  onUserStatus: protectedProcedure.subscription(() => {
    return createRedisSubscription<Status>(
      STATUS_CHANNEL,
      (rawMessage) => JSON.parse(rawMessage) as Status,
    );
  }),
});
