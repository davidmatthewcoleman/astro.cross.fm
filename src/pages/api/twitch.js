import fetch from 'node-fetch';
import NodeCache from 'node-cache';
import { fetchTwitchToken } from "../../lib/api.js";
export const prerender = false;

export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const channel = url.searchParams.get('channel');

    if (!channel) {
        return new Response(null, {
            status: 500,
            statusText: 'Channel is required'
        });
    }

    const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache for 5 minutes
    const cacheKey = `twitch_stream_${channel}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const token = await fetchTwitchToken();

    const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Client-ID': import.meta.env.TWITCH_CLIENT_ID
        }
    });

    if (!response.ok) {
        return new Response(null, {
            status: 500,
            statusText: `Failed to fetch data: ${response.statusText}`
        });
    }

    const { data } = await response.json();
    cache.set(cacheKey, JSON.stringify(data));

    return new Response(
        JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}