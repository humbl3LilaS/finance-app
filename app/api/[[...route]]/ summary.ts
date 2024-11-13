import { db } from "@/database/drizzle";
import { accounts, categories, transactions } from "@/database/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gt, gte, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().get(
	"/",
	clerkMiddleware(),
	zValidator(
		"query",
		z.object({
			from: z.string().optional(),
			to: z.string().optional(),
			accountId: z.string().optional(),
		}),
	),
	async (ctx) => {
		const auth = getAuth(ctx);

		const { from, to, accountId } = ctx.req.valid("query");

		if (!auth?.userId) {
			ctx.json({ error: "Unauthorized" }, 401);
		}

		const defaultTo = new Date();
		const defaultFrom = subDays(defaultTo, 30);

		const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
		const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

		const periodLength = differenceInDays(endDate, startDate) + 1;

		const lastPeriodStart = subDays(startDate, periodLength);
		const lastPeriodEnd = subDays(endDate, periodLength);

		const [currentPeriod] = await fetchFinancialData(accountId, auth?.userId, startDate, endDate);
		const [lastPeriod] = await fetchFinancialData(accountId, auth?.userId, lastPeriodStart, lastPeriodEnd);

		const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
		const expenseChange = calculatePercentageChange(currentPeriod.expense, lastPeriod.expense);
		const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining);

		const category = await db
			.select({
				name: categories.name,
				value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
			})
			.from(transactions)
			.innerJoin(accounts, eq(transactions.accountId, accounts.id))
			.innerJoin(categories, eq(transactions.categoryId, categories.id))
			.where(
				and(
					accountId ? eq(transactions.accountId, accountId) : undefined,
					eq(accounts.userId, auth?.userId ?? ""),
					gt(transactions.amount, 0),
					gte(transactions.date, startDate),
					lte(transactions.date, endDate),
				),
			)
			.groupBy(categories.name)
			.orderBy(desc(sql`SUM(ABS(${transactions.amount}))`));

		const topCategories = category.slice(0, 3);
		const otherCategories = category.slice(3);
		const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);

		const finalCategories =
			otherCategories.length > 0 ? [...topCategories, { name: "other", value: otherSum }] : topCategories;

		const activeDays = await db
			.select({
				date: transactions.date,
				income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
				expense: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
			})
			.from(transactions)
			.innerJoin(accounts, eq(accounts.id, transactions.accountId))
			.where(
				and(
					accountId ? eq(transactions.accountId, accountId) : undefined,
					eq(accounts.userId, auth?.userId ?? ""),
					gte(transactions.date, startDate),
					lte(transactions.date, endDate),
				),
			)
			.groupBy(transactions.date)
			.orderBy(transactions.date);

		const days = fillMissingDays(activeDays, startDate, endDate);

		return ctx.json({
			data: {
				remainingAmount: currentPeriod.remaining,
				remainingChange,
				incomeAmount: currentPeriod.income,
				incomeChange,
				expenseAmount: currentPeriod.expense,
				expenseChange,
				categories: finalCategories,
				days,
			},
		});
	},
);

async function fetchFinancialData(
	accountId: string | undefined,
	userId: string | undefined | null,
	startDate: Date,
	endDate: Date,
) {
	if (!userId) {
		return [];
	}

	return await db
		.select({
			income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
			expense: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
			remaining: sum(transactions.amount).mapWith(Number),
		})
		.from(transactions)
		.innerJoin(accounts, eq(transactions.accountId, accounts.id))
		.where(
			and(
				accountId ? eq(transactions.accountId, accountId) : undefined,
				eq(accounts.userId, userId),
				gte(transactions.date, startDate),
				lte(transactions.date, endDate),
			),
		);
}

export default app;
