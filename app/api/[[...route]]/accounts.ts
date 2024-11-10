import {Hono} from "hono";
import {db} from "@/database/drizzle";
import {accounts, insertAccountSchema} from "@/database/schema";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {and, eq} from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2";
import {z} from "zod";
import {inArray} from "drizzle-orm/sql/expressions/conditions";

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

            return ctx.json({data}, 200);
        })
    .post(
        "/",
        clerkMiddleware(),
        zValidator("json", insertAccountSchema.pick({name: true})),
        async (ctx) => {

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
    )
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator("json",
            z.object({
                ids: z.array(z.string()),
            })
        ),
        async (ctx) => {
            const auth = getAuth(ctx);
            const values = ctx.req.valid("json");

            if (!auth?.userId) {
                return ctx.json({error: "Unauthorized"}, 401);
            }

            const data = await db.delete(accounts)
                .where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, values.ids)))
                .returning({id: accounts.id});

            return ctx.json({data});
        }
    );

export default app;