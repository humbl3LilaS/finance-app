import {Hono} from "hono";
import {handle} from "hono/vercel";
import accounts from "@/app/api/[[...route]]/accounts";
import {cors} from "hono/cors";


// export const runtime = "edge";

const app = new Hono().basePath("/api");
app.use("*", cors());


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;