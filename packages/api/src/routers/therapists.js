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
exports.therapistsRouter = void 0;
var therapists_1 = require("@arianne/db/schemas/therapists");
var server_1 = require("@trpc/server");
var drizzle_orm_1 = require("drizzle-orm");
var zod_1 = require("zod");
var trpc_1 = require("../trpc");
exports.therapistsRouter = (0, trpc_1.createTRPCRouter)({
    get: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var therapist;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.therapists.findFirst({
                        where: function (t, _a) {
                            var eq = _a.eq;
                            return eq(t.id, input.id);
                        },
                        with: {
                            profile: {
                                extras: function (fields) {
                                    return {
                                        name: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                                    };
                                },
                            },
                        },
                    })];
                case 1:
                    therapist = _c.sent();
                    if (!(therapist === null || therapist === void 0 ? void 0 : therapist.profile)) {
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: "Therapist not found",
                        });
                    }
                    return [2 /*return*/, therapist];
            }
        });
    }); }),
    findUnique: trpc_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var therapist;
        var ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.therapists.findFirst({
                        where: function (t, _a) {
                            var eq = _a.eq;
                            return eq(t.profileId, ctx.user.id);
                        },
                        with: {
                            profile: {
                                extras: function (fields) {
                                    return {
                                        name: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                                    };
                                },
                            },
                            notes: true,
                            patients: {
                                with: {
                                    profile: {
                                        extras: function (fields) {
                                            return {
                                                name: (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                                            };
                                        },
                                    },
                                    medicalRecords: true,
                                },
                            },
                        },
                    })];
                case 1:
                    therapist = _c.sent();
                    return [2 /*return*/, therapist];
            }
        });
    }); }),
    getAllPatients: trpc_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patients;
        var ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.patients.findMany({
                        where: function (p, _a) {
                            var eq = _a.eq;
                            return eq(p.therapistId, ctx.user.id);
                        },
                        with: {
                            profile: {
                                extras: function (fields) {
                                    return {
                                        name: (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                                    };
                                },
                            },
                            medicalRecords: true,
                        },
                    })];
                case 1:
                    patients = _c.sent();
                    return [2 /*return*/, patients];
            }
        });
    }); }),
    updateRecentPatients: trpc_1.protectedProcedure
        .input(zod_1.z.object({ patientId: zod_1.z.string() }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var therapist, recentPatients, index;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.therapists.findFirst({
                        where: function (t, _a) {
                            var eq = _a.eq;
                            return eq(t.profileId, ctx.user.id);
                        },
                        columns: {
                            recentPatients: true,
                        },
                    })];
                case 1:
                    therapist = _c.sent();
                    if (!therapist) {
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: "Therapist not found",
                        });
                    }
                    recentPatients = therapist.recentPatients;
                    recentPatients.unshift(input.patientId);
                    index = recentPatients.lastIndexOf(input.patientId);
                    if (index !== 0) {
                        recentPatients.splice(index, 1);
                    }
                    else if (recentPatients.length > 5) {
                        recentPatients.pop();
                    }
                    // Update the therapist's recentPatients
                    return [4 /*yield*/, ctx.db
                            .update(therapists_1.therapists)
                            .set({ recentPatients: recentPatients })
                            .where((0, drizzle_orm_1.eq)(therapists_1.therapists.profileId, ctx.user.id))];
                case 2:
                    // Update the therapist's recentPatients
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); }),
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
