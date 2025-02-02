import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const STEAM_API_KEY = import.meta.env.STEAM_API_KEY;
const STEAM_USER_ID = import.meta.env.STEAM_USER_ID;

async function fetchSteamGames(id) {
    const cacheKey = `steam_games_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&format=json`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, JSON.stringify(data));

    return data;
}

export { fetchSteamGames };