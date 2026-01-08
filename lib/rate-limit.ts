import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
    interval: number; // Time window in ms
    uniqueTokenPerInterval: number; // Max unique tokens
};

export function rateLimit(options: RateLimitOptions) {
    const tokenCache = new LRUCache({
        max: options.uniqueTokenPerInterval || 500,
        ttl: options.interval || 60000,
    });

    return {
        check: (token: string, limit: number) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, [1]);
                    resolve();
                } else if (tokenCount[0] < limit) {
                    tokenCache.set(token, [tokenCount[0] + 1]);
                    resolve();
                } else {
                    reject(new Error('Rate limit exceeded'));
                }
            }),
    };
}
