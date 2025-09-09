import { foreignKey } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

import { createTable } from "../table";
import { mapEnumValues } from "../utils";

const roles = ["therapist", "patient"] as const;

export const profileEnums = {
  role: mapEnumValues(roles),
};

export const profiles = createTable(
  "profiles",
  (d) => ({
    id: d.uuid().primaryKey().notNull(),
    email: d.text().notNull(),

    firstName: d.text("first_name").notNull(),
    lastName: d.text("last_name").notNull(),
    phone: d.text(),
    address: d.text(),
    avatarUrl: d.text("avatar_url"),
    role: d.text("role").$type<(typeof roles)[number]>().notNull(),
  }),
  (table) => [
    foreignKey({
      columns: [table.id],
      // reference to the auth table from Supabase
      foreignColumns: [authUsers.id],
      name: "profiles_id_fk",
    }).onDelete("cascade"),
  ],
).enableRLS();
