// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `arianne_${name}`);

export const users = createTable(
  "users",
  (d) => ({
    id: d.serial("id").primaryKey(),
    fullName: d.text("full_name"),
    phone: d.varchar("phone", { length: 256 }),
  }),
  (t) => [index("fullName").on(t.fullName)],
);
