import { administrationsRouter } from "./routers/administrations";
import { assignmentsRouter } from "./routers/assignments";
import { chatsRouter } from "./routers/chats";
import { diariesRouter } from "./routers/diaries"; // Ensure this import is correct
import { eventRouter } from "./routers/events";
import { exportsRouter } from "./routers/exports";
import { medicalRecordsRouter } from "./routers/medical-records";
import { notesRouter } from "./routers/notes";
import { notificationsRouter } from "./routers/notifications";
import { patientsRouter } from "./routers/patients";
import { patientsPersonalRouter } from "./routers/patients-personal";
import { preferencesRouter } from "./routers/preferences";
import { profileRouter } from "./routers/profiles";
import { testRouter } from "./routers/test";
import { therapistsRouter } from "./routers/therapists";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  administrations: administrationsRouter,
  assignments: assignmentsRouter,
  chats: chatsRouter,
  diaries: diariesRouter,
  events: eventRouter,
  exports: exportsRouter,
  medicalRecords: medicalRecordsRouter,
  notes: notesRouter,
  notifications: notificationsRouter,
  patients: patientsRouter,
  patientsPersonal: patientsPersonalRouter,
  preferences: preferencesRouter,
  profiles: profileRouter,
  therapists: therapistsRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
