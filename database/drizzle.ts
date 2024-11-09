import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";

export const sql = neon(process.env.DB_URI!);
export const db = drizzle(sql);


