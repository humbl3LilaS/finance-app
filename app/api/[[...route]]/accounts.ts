import { Hono } from "hono";
import { db } from "@/database/drizzle";
import { accounts, insertAccountSchema } from "@/database/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

const app = new Hono()
	.get("/", clerkMiddleware(), async (ctx) => {
		const user = getAuth(ctx);

		if (!user?.userId) {
			return ctx.json({ error: "Unauthorized" }, 401);
		}

		const data = await db
			.select({
				id: accounts.id,
				name: accounts.name,
			})
			.from(accounts)
			.where(eq(accounts.userId, user.userId));

		return ctx.json({ data }, 200);
	})
	.get(
		"/:id",
		zValidator(
			"param",
			z.object({
				id: z.string().optional(),
			}),
		),
		clerkMiddleware(),
		async (ctx) => {
			const auth = getAuth(ctx);
			const { id } = ctx.req.valid("param");

			if (!id) {
				return ctx.json({ error: "Bad request: Missing id" }, 400);
			}

			if (!auth?.userId) {
				return ctx.json({ error: "Unauthorized" }, 401);
			}

			const [data] = await db
				.select({
					id: accounts.id,
					name: accounts.name,
				})
				.from(accounts)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

			if (!data) {
				return ctx.json({ error: "Not found" }, 404);
			}
			return ctx.json({ data });
		},
	)
	.post("/", clerkMiddleware(), zValidator("json", insertAccountSchema.pick({ name: true })), async (ctx) => {
		const auth = getAuth(ctx);
		const payload = ctx.req.valid("json");

		if (!auth?.userId) {
			return ctx.json({ error: "Unauthorized" }, 401);
		}
		const [data] = await db
			.insert(accounts)
			.values({
				id: createId(),
				userId: auth.userId,
				...payload,
			})
			.returning();

		return ctx.json({ data });
	})
	.post(
		"/bulk-delete",
		clerkMiddleware(),
		zValidator(
			"json",
			z.object({
				ids: z.array(z.string()),
			}),
		),
		async (ctx) => {
			const auth = getAuth(ctx);
			const values = ctx.req.valid("json");

			if (!auth?.userId) {
				return ctx.json({ error: "Unauthorized" }, 401);
			}

			const data = await db
				.delete(accounts)
				.where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, values.ids)))
				.returning({ id: accounts.id });

			return ctx.json({ data });
		},
	)
	.patch(
		"/:id",
		clerkMiddleware(),
		zValidator(
			"param",
			z.object({
				id: z.string().optional(),
			}),
		),
		zValidator("json", insertAccountSchema.pick({ name: true })),
		async (ctx) => {
			const auth = getAuth(ctx);
			const { id } = ctx.req.valid("param");
			const values = ctx.req.valid("json");
			if (!id) {
				return ctx.json({ error: "Bad request: Missing id" }, 400);
			}

			if (!auth?.userId) {
				return ctx.json({ error: "Unauthorized" }, 401);
			}

			const [data] = await db
				.update(accounts)
				.set(values)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
				.returning();

			if (!data) {
				return ctx.json({ error: "Not found" }, 404);
			}
			return ctx.json({ data });
		},
	)
	.delete(
		"/:id",
		clerkMiddleware(),
		zValidator(
			"param",
			z.object({
				id: z.string().optional(),
			}),
		),
		async (ctx) => {
			const auth = getAuth(ctx);
			const { id } = ctx.req.valid("param");

			if (!id) {
				return ctx.json({ error: "Bad request: Missing id" }, 400);
			}

			if (!auth?.userId) {
				return ctx.json({ error: "Unauthorized" }, 401);
			}

			const [data] = await db
				.delete(accounts)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
				.returning({
					id: accounts.id,
				});

			if (!data) {
				return ctx.json({ error: "Not found" }, 404);
			}
			return ctx.json({ data });
		},
	);

export default app;
