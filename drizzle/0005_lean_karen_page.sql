CREATE TABLE IF NOT EXISTS "categories" (
	"accountId" text PRIMARY KEY NOT NULL,
	"plaid_id" text,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
