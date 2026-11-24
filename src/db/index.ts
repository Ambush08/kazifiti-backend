import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './schema/index.js';
import env from "../env.js";
import { logger } from "../utils/logger.js";



if(!env.databaseUrl){
    throw new Error('Missing DATABASE_URL in env variables')
}


const pool = new Pool({
    connectionString: env.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
});


//Listen for db connection errors
pool.on('error', (err) => {
    logger.error({ err }, "Unexpected error on idle database client",)
});


export const verifyDbConnection = async () => {
  await pool.query("select 1");
  logger.info("Database connection verified");
};


const db = drizzle({
    client: pool,
    schema
});


export default db;