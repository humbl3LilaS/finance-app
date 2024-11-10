import {Hono} from "hono";
import {handle} from "hono/vercel";
import accounts from "@/app/api/[[...route]]/accounts";
import {cors} from "hono/cors";
import categories from "./categories";


// export const runtime = "edge";

const app = new Hono().basePath("/api");
app.use("*", cors());


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
    .route("/accounts", accounts)
    .route("/categories", categories);


export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;