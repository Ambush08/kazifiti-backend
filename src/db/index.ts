import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './schema/index.js';
import dotenv from 'dotenv';



dotenv.config();

if(!process.env.DATABASE_URL){
    throw new Error('Missing DATABASE_URL in env variables')
}


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 3000
});

//Listen for database connection
pool.on('connect', () => {
    console.log('Database connected successfully')
});

//Listen for errors in db connection
pool.on('error', (err) => {
    console.log('Database connection error:', err)
});


const db = drizzle({ client: pool, schema});


export default db;