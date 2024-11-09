import {pgTable, text} from "drizzle-orm/pg-core";


export const account = pgTable("accounts", {
    id: text("accountId").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export type InsertAccount = typeof account.$inferInsert;