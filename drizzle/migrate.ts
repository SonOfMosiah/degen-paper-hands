
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'
import {sql} from "@vercel/postgres";

// inspired by Raphael Moreau @rphlmr for Postgres, extended for Planetscale
const runMigrate = async () => {
    if (!process.env.MONO_DATABASE_URL) {
        throw new Error('MONO_DATABASE_URL is not defined')
    }

    const db = drizzle(sql)

    const start = Date.now()

    await migrate(db, { migrationsFolder: 'drizzle/migrations' })

    const end = Date.now()

    process.exit(0)
}

runMigrate().catch((err) => {
    console.error('❌ Migration failed')
    console.error(err)
    process.exit(1)
})
