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
exports.exportsRouter = void 0;
var enums_1 = require("@arianne/db/enums");
var schema_1 = require("@arianne/db/schema");
var server_1 = require("@trpc/server");
var drizzle_orm_1 = require("drizzle-orm");
var zod_1 = require("zod");
var trpc_1 = require("../trpc");
var host = process.env.NEXT_PUBLIC_APP_URL;
exports.exportsRouter = (0, trpc_1.createTRPCRouter)({
    getTValue: trpc_1.protectedProcedure
        .meta({ createResource: false, doLog: false })
        .input(zod_1.z.object({
        patientId: zod_1.z.string(),
        type: zod_1.z.string(),
    }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patientId, type, count;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    patientId = input.patientId, type = input.type;
                    return [4 /*yield*/, ctx.db.$count(schema_1.administrations, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.administrations.patientId, patientId), (0, drizzle_orm_1.eq)(schema_1.administrations.type, type)))];
                case 1:
                    count = _c.sent();
                    return [2 /*return*/, { T: count }];
            }
        });
    }); }),
    exportPDF: trpc_1.protectedProcedure
        .meta({ createResource: false, doLog: false })
        .input(zod_1.z.object({
        patientId: zod_1.z.string(),
        options: zod_1.z.object({
            notes: zod_1.z.boolean().optional(),
            scores: zod_1.z.boolean().optional(),
            responses: zod_1.z.boolean().optional(),
        }),
        questionnaires: zod_1.z.array(zod_1.z.string()),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var therapist, patient, administrations, modalities, questionnaires, data, response;
        var _c, _d, _e;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    therapist = ctx.user;
                    return [4 /*yield*/, ctx.db.query.patients.findFirst({
                            where: function (t, _a) {
                                var eq = _a.eq;
                                return eq(t.id, input.patientId);
                            },
                            with: {
                                medicalRecords: true,
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
                    patient = _f.sent();
                    if (!(patient === null || patient === void 0 ? void 0 : patient.profile)) {
                        throw new server_1.TRPCError({
                            message: "Patient not found",
                            code: "NOT_FOUND",
                        });
                    }
                    return [4 /*yield*/, ctx.db.query.administrations.findMany({
                            where: function (t, _a) {
                                var and = _a.and, eq = _a.eq, inArray = _a.inArray;
                                return and(inArray(t.id, input.questionnaires), eq(t.patientId, input.patientId));
                            },
                        })];
                case 2:
                    administrations = _f.sent();
                    modalities = enums_1.$Enums.AssignmentModality;
                    questionnaires = administrations.map(function (administration) {
                        return {
                            type: administration.type,
                            response: administration.records,
                            T: administration.T,
                            data: administration.date.toLocaleDateString("it"),
                            notes: "", //TODO sostituire con "administration.notes"(?) quando verranno implementate le note delle somministrazioni
                            mode: modalities[administration.modality],
                        };
                    });
                    data = {
                        patient: {
                            name: patient.profile.name,
                            dateOfBirth: (_d = (_c = patient.medicalRecords) === null || _c === void 0 ? void 0 : _c.birthDate) === null || _d === void 0 ? void 0 : _d.toLocaleDateString("it"),
                            Gender: (_e = patient.medicalRecords) === null || _e === void 0 ? void 0 : _e.sex,
                            ID: patient.profile.id,
                        },
                        therapist: {
                            name: therapist.name,
                            email: therapist.email,
                            phone: therapist.phone,
                        },
                        questionnaires: questionnaires,
                        options: {
                            notes: false, //TODO sostituire con "input.options.notes" quando verranno implementate le note delle somministrazioni
                            scores: input.options.scores,
                            responses: input.options.responses,
                        },
                    };
                    return [4 /*yield*/, fetch("".concat(host, "/api/pdf"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        })];
                case 3:
                    response = _f.sent();
                    return [4 /*yield*/, response.json()];
                case 4: return [2 /*return*/, (_f.sent())];
            }
        });
    }); }),
    exportCSV: trpc_1.protectedProcedure
        .meta({ createResource: false, doLog: false })
        .input(zod_1.z.object({
        questionnaires: zod_1.z.array(zod_1.z.string()),
        exportable: zod_1.z.boolean().optional().default(true),
    }))
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var administrations, questionnairesCSV, _i, administrations_1, administration, administrationTypeModule, error_1;
        var ctx = _b.ctx, input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.administrations.findMany({
                        where: function (t, _a) {
                            var inArray = _a.inArray;
                            return inArray(t.id, input.questionnaires);
                        },
                    })];
                case 1:
                    administrations = _c.sent();
                    questionnairesCSV = [];
                    _i = 0, administrations_1 = administrations;
                    _c.label = 2;
                case 2:
                    if (!(_i < administrations_1.length)) return [3 /*break*/, 7];
                    administration = administrations_1[_i];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, Promise.resolve("".concat("@/features/questionnaires/".concat(administration.type, "/export"))).then(function (s) { return require(s); })];
                case 4:
                    administrationTypeModule = (_c.sent());
                    questionnairesCSV.push({
                        type: administration.type,
                        T: administration.T,
                        csv: administrationTypeModule.generateCSV(administration.records),
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    console.log("Error processing type ".concat(administration.type, ":"), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, questionnairesCSV];
            }
        });
    }); }),
});
var templateObject_1;
