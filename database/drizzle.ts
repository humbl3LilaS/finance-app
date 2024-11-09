import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import {config} from "dotenv";

config({path: ".env.local"});

export const sql = neon(process.env.DB_URI!);
export const db = drizzle({client: sql});


