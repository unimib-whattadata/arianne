"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var administrations_1 = require("./routers/administrations");
var assignments_1 = require("./routers/assignments");
var chats_1 = require("./routers/chats");
var diaries_1 = require("./routers/diaries"); // Ensure this import is correct
var events_1 = require("./routers/events");
var exports_1 = require("./routers/exports");
var medical_records_1 = require("./routers/medical-records");
var notes_1 = require("./routers/notes");
var notifications_1 = require("./routers/notifications");
var patients_1 = require("./routers/patients");
var preferences_1 = require("./routers/preferences");
var profiles_1 = require("./routers/profiles");
var test_1 = require("./routers/test");
var therapists_1 = require("./routers/therapists");
var trpc_1 = require("./trpc");
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    administrations: administrations_1.administrationsRouter,
    assignments: assignments_1.assignmentsRouter,
    chats: chats_1.chatsRouter,
    diaries: diaries_1.diariesRouter,
    events: events_1.eventRouter,
    exports: exports_1.exportsRouter,
    medicalRecords: medical_records_1.medicalRecordsRouter,
    notes: notes_1.notesRouter,
    notifications: notifications_1.notificationsRouter,
    patients: patients_1.patientsRouter,
    preferences: preferences_1.preferencesRouter,
    profiles: profiles_1.profileRouter,
    therapists: therapists_1.therapistsRouter,
    test: test_1.testRouter,
});
