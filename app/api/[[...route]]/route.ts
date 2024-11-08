import {Hono} from 'hono';
import {handle} from "hono/vercel";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth"

export const runtime = "edge";

const app = new Hono().basePath("/api");


app.get(
    "/hello",
    clerkMiddleware(),
    (ctx) => {
        const auth = getAuth(ctx);

        if(!auth?.userId) {
            return ctx.json({"error": "Unauthorized"})
        }

        return ctx.json(
            {
                message: "Hello flame boy !"
            }
        )
    }
)

app.get("/superhello", (ctx) => {
    return ctx.json({message: "super hello"})
})


export const GET = handle(app);
export const PUT = handle(app);