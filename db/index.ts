import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Declare global type for the cached connection and drizzle instance
declare global {
    // eslint-disable-next-line no-var
    var __db: ReturnType<typeof postgres> | undefined;
    // eslint-disable-next-line no-var
    var __drizzle: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

// Create a singleton connection with proper pooling
// Uses lazy initialization to prevent errors during build time
const getClient = () => {
    const DATABASE_URL = process.env.DATABASE_URL;

    // During build time, DATABASE_URL won't be available
    // This check prevents the build from failing
    if (!DATABASE_URL) {
        throw new Error('DATABASE_URL is not set');
    }

    // In development, use global to preserve connection across HMR
    if (process.env.NODE_ENV === 'development') {
        if (!global.__db) {
            global.__db = postgres(DATABASE_URL, {
                max: 10, // Maximum 10 connections in the pool
                idle_timeout: 20, // Close idle connections after 20 seconds
                connect_timeout: 10, // Timeout after 10 seconds if connection fails
            });
        }
        return global.__db;
    }

    // In production, create a new pool (Next.js will manage this across serverless instances)
    return postgres(DATABASE_URL, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
    });
};

// Lazy initialization - db connection is only created when first accessed
const getDb = () => {
    if (process.env.NODE_ENV === 'development') {
        if (!global.__drizzle) {
            global.__drizzle = drizzle(getClient(), { schema });
        }
        return global.__drizzle;
    }
    return drizzle(getClient(), { schema });
};

// Export a proxy that lazily initializes the database connection
// This prevents the connection from being created at build time
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
    get(_target, prop) {
        const actualDb = getDb();
        const value = actualDb[prop as keyof typeof actualDb];
        if (typeof value === 'function') {
            return value.bind(actualDb);
        }
        return value;
    },
});
