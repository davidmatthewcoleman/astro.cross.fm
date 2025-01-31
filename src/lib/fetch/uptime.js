import fetch from 'node-fetch';
import NodeCache from 'node-cache';

// Initialize cache with a TTL of 30 days (in seconds)
const cache = new NodeCache({ stdTTL: 60 });

async function fetchUptime() {
    const cacheKey = `uptime_data`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://uptime.betterstack.com/api/v2/monitors`, {
        method: 'GET',
        headers: {
            'User-Agent': 'TWENTY7',
            'Authorization': `Bearer ${import.meta.env.UPTIME_API_TOKEN}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const transientValue = JSON.stringify(data);
    cache.set(cacheKey, transientValue);

    return data;
}

export { fetchUptime };
