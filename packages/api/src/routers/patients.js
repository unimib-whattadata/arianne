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
exports.patientsRouter = void 0;
var patients_1 = require("@arianne/db/schemas/patients");
var drizzle_orm_1 = require("drizzle-orm");
var trpc_1 = require("../trpc");
exports.patientsRouter = (0, trpc_1.createTRPCRouter)({
    get: trpc_1.protectedProcedure.query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patient;
        var ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.patients.findFirst({
                        where: function (t, _a) {
                            var eq = _a.eq;
                            return eq(t.profileId, ctx.user.id);
                        },
                    })];
                case 1:
                    patient = _c.sent();
                    return [2 /*return*/, patient];
            }
        });
    }); }),
    findUnique: trpc_1.protectedProcedure
        .input(patients_1.PatientsFindUniqueSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var profileId, patient;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    profileId = input.where.id;
                    return [4 /*yield*/, ctx.db.query.patients.findFirst({
                            where: function (t, _a) {
                                var eq = _a.eq;
                                return eq(t.profileId, profileId);
                            },
                            with: {
                                profile: {
                                    extras: function (fields) {
                                        return {
                                            name: (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
                                        };
                                    },
                                },
                                medicalRecords: {
                                    with: {
                                        administrations: {
                                            orderBy: function (a, _a) {
                                                var desc = _a.desc;
                                                return desc(a.date);
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                case 1:
                    patient = _c.sent();
                    return [2 /*return*/, patient];
            }
        });
    }); }),
    findRecent: trpc_1.protectedProcedure
        .input(patients_1.PatientsFindRecentSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patients;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.patients.findMany({
                        where: function (t, _a) {
                            var inArray = _a.inArray;
                            return inArray(t.profileId, input.recent);
                        },
                        with: {
                            profile: {
                                extras: function (fields) {
                                    return {
                                        name: (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["concat(", ", ' ', ", ")"], ["concat(", ", ' ', ", ")"])), fields.firstName, fields.lastName).as("full_name"),
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
    delete: trpc_1.protectedProcedure
        .input(patients_1.PatientsDeleteSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patient;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .delete(patients_1.patients)
                        .where((0, drizzle_orm_1.eq)(patients_1.patients.profileId, input.where.id))];
                case 1:
                    patient = _c.sent();
                    return [2 /*return*/, patient];
            }
        });
    }); }),
});
var templateObject_1, templateObject_2;
