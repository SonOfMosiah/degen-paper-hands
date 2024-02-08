import {bigint, pgTable, decimal, index, timestamp} from "drizzle-orm/pg-core";

// USER SCHEMA
export const users = pgTable('users', {
    id: bigint('id', {mode: 'number'}).primaryKey(), // fid
    valueLost: decimal('value_lost', { precision: 20, scale: 2 }),
    currentPortfolioValue: decimal('current_portfolio_value', { precision: 20, scale: 2 }),
    potentialPortfolioValue: decimal('potential_portfolio_value', { precision: 20, scale: 2 }),
    degenAmount: decimal('degen_amount', { precision: 65, scale: 2 }),
    lastChecked: timestamp('last_checked').defaultNow(),
},
    (table) => {
        return {
            valueLost: index('value_lost').on(table.valueLost),
        }
    })