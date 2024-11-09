import {Hono} from "hono";
import {handle} from "hono/vercel";
import accounts from "@/api-routes/accounts";
import {HTTPException} from "hono/http-exception";

// export const runtime = "edge";

const app = new Hono().basePath("/api");


// Error handling
app.onError((error, ctx) => {

    // handling of errors that are thrown in api-routes
    if (error instanceof HTTPException) {
        return error.getResponse();
    }

    // handling of global errors
    return ctx.json({"error": "Internal Server Error"}, 401);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const PUT = handle(app);

export type AppType = typeof routes;