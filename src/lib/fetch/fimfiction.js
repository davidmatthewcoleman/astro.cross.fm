import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const FIMFICTION_API_KEY = import.meta.env.FIMFICTION_API_KEY;

// Function to fetch user data from Fimfiction
async function fetchFimfictionUserData(id) {
    if (!id) {
        throw new Error('User ID is required');
    }

    const cacheKey = `fimfiction_user_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://www.fimfiction.net/api/v2/users/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${FIMFICTION_API_KEY}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, JSON.stringify(data));

    return data;
}

// Function to fetch bookshelf data from Fimfiction
async function fetchFimfictionBookshelfData(url) {
    if (!url) {
        throw new Error('URL is required');
    }

    const cacheKey = `fimfiction_bookshelf_${Buffer.from(url).toString('base64')}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const bookshelfId = url.split('/')[4];

    const response = await fetch(`https://www.fimfiction.net/api/v2/bookshelves/${bookshelfId}/items`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${FIMFICTION_API_KEY}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch bookshelf data: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, JSON.stringify(data));

    return data;
}

// Function to fetch story data from Fimfiction
async function fetchFimfictionStoryData(id) {
    if (!id) {
        throw new Error('ID is required');
    }

    const cacheKey = `fimfiction_story_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://www.fimfiction.net/api/v2/stories/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${FIMFICTION_API_KEY}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, JSON.stringify(data));

    return data;
}

export { fetchFimfictionUserData, fetchFimfictionBookshelfData, fetchFimfictionStoryData };
