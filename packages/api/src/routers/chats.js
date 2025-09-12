"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatsRouter = void 0;
var chats_1 = require("@arianne/db/schemas/chats");
var ioredis_1 = require("ioredis");
var zod_1 = require("zod");
var redis_1 = require("../redis");
var trpc_1 = require("../trpc");
var STATUS_CHANNEL = "user:presence";
var ONLINE_USERS_KEY = "online_users";
function createRedisSubscription(channel, parser) {
    return __asyncGenerator(this, arguments, function createRedisSubscription_1() {
        var subscriber, resolveNext, nextPromise, messageHandler, err_1, err_2, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subscriber = new ioredis_1.default(process.env.REDIS);
                    resolveNext = null;
                    nextPromise = new Promise(function (resolve) {
                        resolveNext = resolve;
                    });
                    messageHandler = function (ch, rawMessage) {
                        if (ch === channel) {
                            try {
                                var data = parser(rawMessage);
                                if (resolveNext) {
                                    resolveNext(data);
                                    nextPromise = new Promise(function (resolve) {
                                        resolveNext = resolve;
                                    });
                                }
                            }
                            catch (parseError) {
                                console.error("Error parsing message from Redis channel ".concat(channel, ":"), parseError);
                            }
                        }
                    };
                    subscriber.on("message", messageHandler);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 17]);
                    return [4 /*yield*/, __await(subscriber.subscribe(channel))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, __await(nextPromise)];
                case 4: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                case 5: return [4 /*yield*/, _a.sent()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 17];
                case 8:
                    err_1 = _a.sent();
                    throw new Error("Subscription error on channel ".concat(channel, ": ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                case 9:
                    subscriber.off("message", messageHandler);
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, __await(subscriber.unsubscribe(channel))];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    err_2 = _a.sent();
                    console.error("Error unsubscribing from ".concat(channel, ":"), err_2);
                    return [3 /*break*/, 13];
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, __await(subscriber.quit())];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 16];
                case 15:
                    err_3 = _a.sent();
                    console.error("Error quitting Redis subscriber:", err_3);
                    return [3 /*break*/, 16];
                case 16: return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.chatsRouter = (0, trpc_1.createTRPCRouter)({
    getOrCreate: trpc_1.protectedProcedure
        .input(chats_1.ChatsGetOrCreateSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var chat, newChat_1, messages;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.chats.findFirst({
                        where: function (chats, _a) {
                            var eq = _a.eq;
                            return eq(chats.id, input.patientId);
                        },
                        with: {
                            messages: {
                                orderBy: function (messages, _a) {
                                    var asc = _a.asc;
                                    return asc(messages.index);
                                },
                            },
                        },
                    })];
                case 1:
                    chat = _c.sent();
                    if (!!chat) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db
                            .insert(chats_1.chats)
                            .values({
                            id: input.patientId,
                            patientId: input.patientId,
                            therapistId: input.therapistId,
                            lastIndex: 0,
                        })
                            .returning()
                            .then(function (result) { return result[0]; })];
                case 2:
                    newChat_1 = _c.sent();
                    return [4 /*yield*/, ctx.db.query.messages.findMany({
                            where: function (messages, _a) {
                                var eq = _a.eq;
                                return eq(messages.chatId, newChat_1.id);
                            },
                        })];
                case 3:
                    messages = _c.sent();
                    return [2 /*return*/, __assign(__assign({}, newChat_1), { messages: messages })];
                case 4: return [2 /*return*/, chat];
            }
        });
    }); }),
    addMessage: trpc_1.publicProcedure
        .input(chats_1.ChatsAddMessageSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var chat;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.chats.findFirst({
                        where: function (chats, _a) {
                            var eq = _a.eq;
                            return eq(chats.id, input.chatId);
                        },
                    })];
                case 1:
                    chat = _c.sent();
                    if (!chat) {
                        throw new Error("Chat not found");
                    }
                    return [2 /*return*/];
            }
        });
    }); }),
    onAdd: trpc_1.publicProcedure
        .input(zod_1.z.object({ chatId: zod_1.z.string() }))
        .subscription(function (_a) {
        var input = _a.input;
        return createRedisSubscription("chat:".concat(input.chatId), function (rawMessage) { return JSON.parse(rawMessage); });
    }),
    setUserOnline: trpc_1.protectedProcedure
        .input(zod_1.z.string().optional())
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var userId, chatId, userChatKey, status;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = ctx.user.id;
                    if (!userId) {
                        throw new Error("User not authenticated");
                    }
                    chatId = input !== null && input !== void 0 ? input : ctx.user.id;
                    userChatKey = "".concat(userId, ":").concat(chatId);
                    return [4 /*yield*/, redis_1.cache.sadd(ONLINE_USERS_KEY, userChatKey)];
                case 1:
                    _c.sent();
                    status = {
                        userId: userId,
                        chatId: chatId,
                        status: "online",
                    };
                    return [4 /*yield*/, redis_1.publisher.publish(STATUS_CHANNEL, JSON.stringify(status))];
                case 2:
                    _c.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); }),
    setUserOffline: trpc_1.protectedProcedure
        .input(zod_1.z.string().optional())
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var userId, chatId, userChatKey, status;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = ctx.user.id;
                    if (!userId) {
                        throw new Error("User not authenticated");
                    }
                    chatId = input !== null && input !== void 0 ? input : ctx.user.id;
                    userChatKey = "".concat(userId, ":").concat(chatId);
                    return [4 /*yield*/, redis_1.cache.srem(ONLINE_USERS_KEY, userChatKey)];
                case 1:
                    _c.sent();
                    status = {
                        userId: userId,
                        chatId: chatId,
                        status: "offline",
                    };
                    return [4 /*yield*/, redis_1.publisher.publish(STATUS_CHANNEL, JSON.stringify(status))];
                case 2:
                    _c.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); }),
    isUserOnline: trpc_1.protectedProcedure
        .input(zod_1.z.object({ chatId: zod_1.z.string(), userId: zod_1.z.string() }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var userChatKey, isOnline;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userChatKey = "".concat(input.userId, ":").concat(input.chatId);
                    return [4 /*yield*/, redis_1.cache.sismember(ONLINE_USERS_KEY, userChatKey)];
                case 1:
                    isOnline = _c.sent();
                    return [2 /*return*/, isOnline === 1];
            }
        });
    }); }),
    setUserTyping: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        typingStatus: zod_1.z.enum(["isTyping", "stoppedTyping"]),
        chatId: zod_1.z.string().optional(),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var userId, status;
        var _c;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    userId = ctx.user.id;
                    if (!userId) {
                        throw new Error("User not authenticated");
                    }
                    status = {
                        userId: userId,
                        chatId: (_c = input.chatId) !== null && _c !== void 0 ? _c : userId,
                        status: input.typingStatus === "isTyping" ? "isTyping" : "online",
                    };
                    return [4 /*yield*/, redis_1.publisher.publish(STATUS_CHANNEL, JSON.stringify(status))];
                case 1:
                    _d.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); }),
    onUserStatus: trpc_1.protectedProcedure.subscription(function () {
        return createRedisSubscription(STATUS_CHANNEL, function (rawMessage) { return JSON.parse(rawMessage); });
    }),
});
