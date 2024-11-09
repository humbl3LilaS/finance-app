import {config} from "dotenv";
import {defineConfig} from "drizzle-kit";

config({path: ".env.local"});

export default defineConfig(
    {
        schema: "./database/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        dbCredentials: {
            url: process.env.DB_URI!,
        },
        verbose: true,
        strict: true
    }
);