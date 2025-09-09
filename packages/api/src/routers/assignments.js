"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.assignmentsRouter = void 0;
var assignments_1 = require("@arianne/db/schemas/assignments");
var drizzle_orm_1 = require("drizzle-orm");
var trpc_1 = require("../trpc");
exports.assignmentsRouter = (0, trpc_1.createTRPCRouter)({
    get: trpc_1.protectedProcedure
        .input(assignments_1.AssignmentsFindUniqueSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var userId, assignments;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    userId = ctx.user.id;
                    return [4 /*yield*/, ctx.db.query.assignments.findMany({
                            where: function (assignments, _a) {
                                var eq = _a.eq;
                                if (input === null || input === void 0 ? void 0 : input.where.id) {
                                    return eq(assignments.patientId, input.where.id);
                                }
                                return eq(assignments.patientId, userId);
                            },
                            extras: function (t, _a) {
                                var sql = _a.sql;
                                return ({
                                    path: sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CASE\n            WHEN ", " = ", " THEN REPLACE(", ", ' ', '-')\n            WHEN ", " = ", " THEN ", "\n            ELSE ''\n          END"], ["CASE\n            WHEN ", " = ", " THEN REPLACE(", ", ' ', '-')\n            WHEN ", " = ", " THEN ", "\n            ELSE ''\n          END"])), t.type, assignments_1.assignmentTypeEnum.enumValues[0], t.name, t.type, assignments_1.assignmentTypeEnum.enumValues[1], t.name).as("path"),
                                });
                            },
                        })];
                case 1:
                    assignments = _c.sent();
                    return [2 /*return*/, assignments];
            }
        });
    }); }),
    update: trpc_1.protectedProcedure
        .input(assignments_1.AssignmentsUpdateSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var id, data, assignment;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = input.where.id;
                    data = input.data;
                    return [4 /*yield*/, ctx.db
                            .update(assignments_1.assignments)
                            .set(data)
                            .where((0, drizzle_orm_1.eq)(assignments_1.assignments.id, id))
                            .returning()
                            .then(function (res) { return res[0]; })];
                case 1:
                    assignment = _c.sent();
                    return [2 /*return*/, assignment];
            }
        });
    }); }),
    delete: trpc_1.protectedProcedure
        .input(assignments_1.AssignmentsDeleteSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var assignment;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .delete(assignments_1.assignments)
                        .where((0, drizzle_orm_1.eq)(assignments_1.assignments.id, input.where.id))
                        .returning()
                        .then(function (res) { return res[0]; })];
                case 1:
                    assignment = _c.sent();
                    return [2 /*return*/, assignment];
            }
        });
    }); }),
    create: trpc_1.protectedProcedure
        .input(assignments_1.AssignmentsCreateSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var assignment;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .insert(assignments_1.assignments)
                        .values(input)
                        .returning()
                        .then(function (res) { return res[0]; })];
                case 1:
                    assignment = _c.sent();
                    return [2 /*return*/, assignment];
            }
        });
    }); }),
    latest: trpc_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var therapistId, assignments;
        var ctx = _b.ctx;
        return __generator(this, function (_c) {
            therapistId = ctx.user.id;
            assignments = ctx.db.query.assignments.findMany({
                where: function (t, _a) {
                    var eq = _a.eq;
                    return eq(t.therapistId, therapistId);
                },
                with: {
                    patient: {
                        with: {
                            profile: {
                                extras: function (fields) {
                                    return {
                                        name: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                                    };
                                },
                            },
                        },
                    },
                },
                limit: 5,
            });
            return [2 /*return*/, assignments];
        });
    }); }),
});
var templateObject_1, templateObject_2;
