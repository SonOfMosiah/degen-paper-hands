import type { Config } from 'drizzle-kit';

export default {
    schema: './drizzle/schema.ts',
    out: './drizzle/migrations',
    driver: 'pg', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        host: process.env.PG_HOST!,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE!,
    },
} satisfies Config;