import { pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Create a table with a prefix to avoid naming conflicts.
 * This is useful in multi-tenant applications where you want to keep table names unique.
 */
export const createTable = pgTableCreator((name) => `arianne_${name}`);
