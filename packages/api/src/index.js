"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTRPCContext = exports.appRouter = exports.createCaller = void 0;
var root_1 = require("./root");
Object.defineProperty(exports, "appRouter", { enumerable: true, get: function () { return root_1.appRouter; } });
var trpc_1 = require("./trpc");
Object.defineProperty(exports, "createTRPCContext", { enumerable: true, get: function () { return trpc_1.createTRPCContext; } });
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
exports.createCaller = (0, trpc_1.createCallerFactory)(root_1.appRouter);
