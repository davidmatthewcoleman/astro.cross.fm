import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const RAINDROP_API_KEY = import.meta.env.RAINDROP_API_KEY;

// Function to fetch bookshelf data from Raindrop.io
async function fetchRaindropData(id) {
    if (!id) {
        return await fetchRaindropAllBookmarks();
    }

    const cacheKey = `raindropio_bookshelf_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://api.raindrop.io/rest/v1/raindrops/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${RAINDROP_API_KEY}`,
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

async function fetchRaindropUser() {
    const cacheKey = `raindropio_user`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://api.raindrop.io/rest/v1/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${RAINDROP_API_KEY}`,
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

async function fetchRaindropCollection(id) {
    const cacheKey = `raindropio_collection_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://api.raindrop.io/rest/v1/collection/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${RAINDROP_API_KEY}`,
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

async function fetchRaindropAllBookmarks() {
    const data = await fetchRaindropUser();
    const groups = data.user.groups;
    const bookmarks = groups.find(group => group.title === "Bookmarks");
    const output = [];

    for (const collection of bookmarks.collections) {
        const { items } = await fetchRaindropData(collection);

        for (const item of items) {
            output.push(item);
        }
    }

    return output;
}

export { fetchRaindropData, fetchRaindropUser, fetchRaindropCollection, fetchRaindropAllBookmarks };
