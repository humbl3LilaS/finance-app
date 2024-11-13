import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { legacy } from "../.next/server/_error";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { transactions } from "../database/schema";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertAmountToMiliunits(amount: number) {
	return Math.round(amount * 1000);
}

export function convertAmountFromMiliunits(amount: number) {
	return Math.round(amount / 1000);
}

export function formatCurrency(value: number) {
	return Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
	}).format(convertAmountFromMiliunits(value));
}

export function calculatePercentageChange(current: number, previous: number) {
	if (previous === 0) {
		return previous === current ? 0 : 100;
	}

	return (current - previous) / previous;
}

export function fillMissingDays(
	activeDays: {
		date: Date;
		income: number;
		expense: number;
	}[],
	startDate: Date,
	endDate: Date,
) {
	if (activeDays.length === 0) {
		return [];
	}

	const allDays = eachDayOfInterval({
		start: startDate,
		end: endDate,
	});

	const transactionsByDay = allDays.map((day) => {
		const found = activeDays.find((d) => isSameDay(d.date, day));
		if (found) {
			return found;
		} else {
			return {
				date: day,
				income: 0,
				expense: 0,
			};
		}
	});
	return transactionsByDay;
}
