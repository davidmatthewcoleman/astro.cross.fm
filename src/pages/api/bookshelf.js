import NodeCache from 'node-cache';
import { bookshelfQuery } from "../../lib/api.js";
export const prerender = false;

export const GET = async () => {
    const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache for 5 minutes
    const cacheKey = `bookshelf`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const bookshelf = await bookshelfQuery();
    cache.set(cacheKey, JSON.stringify(bookshelf));

    return new Response(
        JSON.stringify(bookshelf), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}