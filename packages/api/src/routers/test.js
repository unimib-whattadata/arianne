"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
var zod_1 = require("zod");
var trpc_1 = require("../trpc");
exports.testRouter = (0, trpc_1.createTRPCRouter)({
    hello: trpc_1.publicProcedure
        .input(zod_1.z.object({ text: zod_1.z.string() }))
        .query(function (_a) {
        var input = _a.input;
        return {
            greeting: "Hello ".concat(input.text),
        };
    }),
});
