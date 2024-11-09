import {pgTable, text} from "drizzle-orm/pg-core";


export const accounts = pgTable("accounts", {
    id: text("accountId").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export type InsertAccount = typeof accounts.$inferInsert;