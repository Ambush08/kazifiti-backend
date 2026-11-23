import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from './schema/index.js';
import env from "../env.js";



if(!env.databaseUrl){
    throw new Error('Missing DATABASE_URL in env variables')
}


const pool = new Pool({
    connectionString: env.databaseUrl,
    max: 10,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 3000
});


//Listen for db connection
pool.on('connect', () => {
    console.log('Database connected successfully')
});


//Listen for db connection errors
pool.on('error', (err) => {
    console.log('Misiing DATABASE URL in env variables:', err)
});


const db = drizzle({
    client: pool,
    schema
});


export default db;