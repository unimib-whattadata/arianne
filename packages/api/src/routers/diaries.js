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
Object.defineProperty(exports, "__esModule", { value: true });
exports.diariesRouter = void 0;
var diaries_1 = require("@arianne/db/schemas/diaries");
var server_1 = require("@trpc/server");
var drizzle_orm_1 = require("drizzle-orm");
var trpc_1 = require("../trpc");
exports.diariesRouter = (0, trpc_1.createTRPCRouter)({
    find: trpc_1.protectedProcedure
        .input(diaries_1.DiariesFindSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var id, date, type, patientId, diary, dateObject, formattedDate, diaries;
        var _c;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    id = input.id, date = input.date, type = input.type;
                    patientId = (_c = input.patientId) !== null && _c !== void 0 ? _c : ctx.user.id;
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.db.query.diaries.findFirst({
                            where: function (t, _a) {
                                var eq = _a.eq;
                                return eq(t.id, id);
                            },
                        })];
                case 1:
                    diary = _d.sent();
                    return [2 /*return*/, diary];
                case 2:
                    dateObject = date ? new Date(date) : new Date();
                    formattedDate = "".concat(dateObject.getFullYear(), "-").concat(dateObject.getMonth() + 1, "-").concat(dateObject.getDate());
                    return [4 /*yield*/, ctx.db.query.diaries.findMany({
                            where: function (t, _a) {
                                var eq = _a.eq, and = _a.and;
                                return and(eq(t.date, formattedDate), eq(t.type, type), eq(t.patientId, patientId));
                            },
                            orderBy: function (t, _a) {
                                var desc = _a.desc;
                                return desc(t.updatedAt);
                            },
                        })];
                case 3:
                    diaries = _d.sent();
                    return [2 /*return*/, diaries.length > 0 ? diaries[0] : null];
            }
        });
    }); }),
    getAll: trpc_1.protectedProcedure
        .input(diaries_1.DiariesGetAllSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patientId, diaries;
        var _c;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    patientId = (_c = input.patientId) !== null && _c !== void 0 ? _c : ctx.user.id;
                    return [4 /*yield*/, ctx.db.query.diaries.findMany({
                            where: function (t, _a) {
                                var eq = _a.eq, and = _a.and;
                                return and(eq(t.type, input.type), eq(t.patientId, patientId));
                            },
                            orderBy: function (t, _a) {
                                var desc = _a.desc;
                                return desc(t.updatedAt);
                            },
                        })];
                case 1:
                    diaries = _d.sent();
                    return [2 /*return*/, diaries];
            }
        });
    }); }),
    create: trpc_1.protectedProcedure
        .input(diaries_1.DiariesCreateSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var patientId, medicalRecord, medicalRecordId, dateObject, date, type, content, diary;
        var _c;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    patientId = (_c = input.patientId) !== null && _c !== void 0 ? _c : ctx.user.id;
                    return [4 /*yield*/, ctx.db.query.medicalRecords.findFirst({
                            where: function (t, _a) {
                                var eq = _a.eq;
                                return eq(t.patientId, patientId);
                            },
                        })];
                case 1:
                    medicalRecord = _d.sent();
                    medicalRecordId = medicalRecord === null || medicalRecord === void 0 ? void 0 : medicalRecord.id;
                    if (!medicalRecordId) {
                        throw new server_1.TRPCError({
                            code: "NOT_FOUND",
                            message: "Medical record not found",
                        });
                    }
                    dateObject = new Date();
                    date = "".concat(dateObject.getFullYear(), "-").concat(dateObject.getMonth() + 1, "-").concat(dateObject.getDate());
                    type = input.type, content = input.content;
                    return [4 /*yield*/, ctx.db
                            .insert(diaries_1.diaries)
                            .values({
                            date: date,
                            type: type,
                            content: JSON.stringify(content),
                            patientId: patientId,
                            medicalRecordId: medicalRecordId,
                        })
                            .returning()
                            .then(function (result) { return result[0]; })];
                case 2:
                    diary = _d.sent();
                    return [2 /*return*/, diary];
            }
        });
    }); }),
    update: trpc_1.protectedProcedure
        .input(diaries_1.DiariesUpdateSchema)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var id, content, state, diary;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = input.id, content = input.content, state = input.state;
                    return [4 /*yield*/, ctx.db
                            .update(diaries_1.diaries)
                            .set(__assign({ content: JSON.stringify(content) }, (state !== undefined && { state: state })))
                            .where((0, drizzle_orm_1.eq)(diaries_1.diaries.id, id))
                            .returning()
                            .then(function (result) { return result[0]; })];
                case 1:
                    diary = _c.sent();
                    return [2 /*return*/, diary];
            }
        });
    }); }),
    findById: trpc_1.protectedProcedure
        .input(diaries_1.DiariesFindByIdSchema)
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var diary;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db.query.diaries.findFirst({
                        where: function (t, _a) {
                            var eq = _a.eq;
                            return eq(t.id, input.id);
                        },
                    })];
                case 1:
                    diary = _c.sent();
                    return [2 /*return*/, diary];
            }
        });
    }); }),
});
