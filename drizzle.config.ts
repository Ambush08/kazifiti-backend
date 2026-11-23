import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import env from './src/env.js';


dotenv.config();


export default defineConfig({
    schema: './src/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.databaseUrl as string
    }
});