import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

// Declare global type for the cached connection
declare global {
    // eslint-disable-next-line no-var
    var __db: ReturnType<typeof postgres> | undefined;
}

// Create a singleton connection with proper pooling
const getClient = () => {
    // In development, use global to preserve connection across HMR
    if (process.env.NODE_ENV === 'development') {
        if (!global.__db) {
            global.__db = postgres(process.env.DATABASE_URL!, {
                max: 10, // Maximum 10 connections in the pool
                idle_timeout: 20, // Close idle connections after 20 seconds
                connect_timeout: 10, // Timeout after 10 seconds if connection fails
            });
        }
        return global.__db;
    }

    // In production, create a new pool (Next.js will manage this across serverless instances)
    return postgres(process.env.DATABASE_URL!, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
    });
};

const client = getClient();
export const db = drizzle(client, { schema });
