import {Hono} from "hono";
import {db} from "@/database/drizzle";
import {accounts, insertAccountSchema} from "@/database/schema";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {eq} from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2";

const app = new Hono()
    .get(
        "/",
        clerkMiddleware(),
        async (ctx) => {
            const user = getAuth(ctx);

            if (!user?.userId) {
                return ctx.json({error: "Unauthorized"}, 401);
            }

            const data = await db.select({
                id: accounts.id,
                name: accounts.name
            }).from(accounts).where(eq(accounts.userId, user.userId));

            return ctx.json({data: data});
        })
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountSchema.pick({name: true})),
        async (ctx) => {

            console.log("request received")
               const auth = getAuth(ctx);
               const payload = ctx.req.valid("json");

               if (!auth?.userId) {
                   return ctx.json({error: "Unauthorized"}, 401);
               }
               const [data] = await db.insert(accounts).values({
                   id: createId(),
                   userId: auth.userId,
                   ...payload
               }).returning();

               return ctx.json({data});
        }
    );

export default app;