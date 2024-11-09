import {Hono} from "hono";
import {db} from "@/database/drizzle";
import {accounts} from "@/database/schema";
import {clerkMiddleware} from "@hono/clerk-auth";
import {auth} from "@clerk/nextjs/server";
import {HTTPException} from "hono/http-exception";

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        async (ctx) => {
            const user = await auth();

            if (!user.userId) {
                throw new HTTPException(401, {
                    res: ctx.json({error: "Unauthorized"}, 401)
                });
            }

            const data = await db.select({
                id: accounts.id,
                name: accounts.name
            }).from(accounts);
            console.log(data);
            return ctx.json({data: data});
        });

export default app;