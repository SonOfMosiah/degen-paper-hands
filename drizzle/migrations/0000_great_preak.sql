CREATE TABLE IF NOT EXISTS "users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"value_lost" numeric(20, 2),
	"current_portfolio_value" numeric(20, 2),
	"potential_portfolio_value" numeric(20, 2),
	"degen_amount" numeric(65, 2),
	"last_checked" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "value_lost" ON "users" ("value_lost");