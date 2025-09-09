"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.createCallerFactory = exports.createTRPCRouter = exports.createTRPCContext = void 0;
var db_1 = require("@arianne/db");
// import { verifyJWT } from "@arianne/supabase";
var server_1 = require("@trpc/server");
var sql_1 = require("drizzle-orm/sql");
var superjson_1 = require("superjson");
var zod_1 = require("zod");
var createInnerTRPCContext = function (opts) {
    return {
        user: opts.user,
        db: db_1.db,
    };
};
var createTRPCContext = function (opts) {
    var _a, _b;
    var source = (_a = opts.headers.get("x-trpc-source")) !== null && _a !== void 0 ? _a : "unknown";
    var data = opts.user.data;
    console.log(">>> tRPC Request from", source, "by", (_b = data.user) === null || _b === void 0 ? void 0 : _b.id);
    return createInnerTRPCContext({
        headers: opts.headers,
        user: opts.user,
    });
};
exports.createTRPCContext = createTRPCContext;
var t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter: function (_a) {
        var shape = _a.shape, error = _a.error;
        return __assign(__assign({}, shape), { data: __assign(__assign({}, shape.data), { zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null }) });
    },
});
/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */
/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
exports.createTRPCRouter = t.router;
exports.createCallerFactory = t.createCallerFactory;
/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
exports.publicProcedure = t.procedure;
/** Reusable middleware that enforces users are logged in before running the procedure. */
/**
 * check middleware @see https://trpc.io/docs/server/middleware
 */
var enforceUserIsAuthed = t.middleware(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user, currentUser;
    var ctx = _b.ctx, next = _b.next;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (ctx.user.error) {
                    throw new server_1.TRPCError({
                        code: "UNAUTHORIZED",
                        cause: ctx.user.error.cause,
                        message: process.env.NODE_ENV === "production"
                            ? "Unauthorized access."
                            : ctx.user.error.message,
                    });
                }
                if (!ctx.user.data.user) {
                    throw new server_1.TRPCError({
                        code: "UNAUTHORIZED",
                        cause: "User not found",
                        message: process.env.NODE_ENV === "production"
                            ? "Unauthorized access."
                            : "User not found.",
                    });
                }
                user = ctx.user.data.user;
                return [4 /*yield*/, ctx.db.query.profiles.findFirst({
                        where: function (t, _a) {
                            var eq = _a.eq;
                            return eq(t.id, user.id);
                        },
                        extras: function (fields) {
                            return {
                                name: (0, sql_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                            };
                        },
                    })];
            case 1:
                currentUser = _c.sent();
                if (!currentUser) {
                    throw new server_1.TRPCError({
                        code: "UNAUTHORIZED",
                        cause: "User not found",
                        message: process.env.NODE_ENV === "production"
                            ? "Unauthorized access."
                            : "User not found.",
                    });
                }
                return [2 /*return*/, next({
                        ctx: {
                            // infers the `user` as non-nullable
                            user: currentUser,
                        },
                    })];
        }
    });
}); });
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
exports.protectedProcedure = t.procedure.use(enforceUserIsAuthed);
var templateObject_1;
//type RouterOutput = inferRouterOutputs<AppRouter>;
