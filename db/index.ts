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

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

// Create a singleton connection with proper pooling
const getClient = () => {
    const DATABASE_URL = process.env.DATABASE_URL;

    // Skip during build or when DATABASE_URL is not available
    if (!DATABASE_URL) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('⚠️ DATABASE_URL not set in production environment');
        }
        return null;
    }

    // In development, use global to preserve connection across HMR
    if (process.env.NODE_ENV === 'development') {
        if (!global.__db) {
            global.__db = postgres(DATABASE_URL, {
                max: 10,
                idle_timeout: 20,
                connect_timeout: 10,
            });
        }
        return global.__db;
    }

    // In production, reuse existing client or create new one
    if (!client) {
        client = postgres(DATABASE_URL, {
            max: 10,
            idle_timeout: 20,
            connect_timeout: 10,
        });
    }
    return client;
};

// Lazy initialization - db connection is only created when first accessed
const getDb = () => {
    const postgresClient = getClient();
    
    // Return null if no client available (during build)
    if (!postgresClient) {
        return null;
    }

    if (process.env.NODE_ENV === 'development') {
        if (!global.__drizzle) {
            global.__drizzle = drizzle(postgresClient, { schema });
        }
        return global.__drizzle;
    }

    // In production, reuse existing instance
    if (!dbInstance) {
        dbInstance = drizzle(postgresClient, { schema });
    }
    return dbInstance;
};

// Create a safe proxy that handles null cases
const createDbProxy = () => {
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
        get(_target, prop) {
            const actualDb = getDb();
            
            // If db is not available, throw meaningful error
            if (!actualDb) {
                throw new Error(
                    'Database connection not available. ' +
                    'This usually happens during build time. ' +
                    'Make sure DATABASE_URL is set in your environment variables.'
                );
            }
            
            const value = actualDb[prop as keyof typeof actualDb];
            if (typeof value === 'function') {
                return value.bind(actualDb);
            }
            return value;
        },
    });
};

// Export the database instance
export const db = createDbProxy();