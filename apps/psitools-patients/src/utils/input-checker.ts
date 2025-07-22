interface Input {
  where?: {
    therapistId?: unknown;
  };
}

interface CreateInput {
  data?: {
    user?: unknown;
    therapist?: {
      connect?: {
        id?: unknown;
      };
    };
  };
}

interface Ctx {
  session: {
    user: {
      id: string;
    };
  };
}

export function createCheck<T extends CreateInput>(input: T, ctx: Ctx): T {
  if (!input.data?.therapist?.connect) {
    input.data = {
      therapist: {
        connect: {
          id: ctx.session.user.id,
        },
      },
    };
  } else {
    input.data.therapist.connect.id = ctx.session.user.id;
  }
  return input;
}

export function check<T extends Input>(input: T, ctx: Ctx): T {
  if (!input.where) {
    input.where = { therapistId: ctx.session.user.id };
  } else {
    input.where.therapistId = ctx.session.user.id;
  }
  return input;
}

const checker = { check, createCheck };
export default checker;
