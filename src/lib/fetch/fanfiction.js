import fetch from 'node-fetch';
import NodeCache from 'node-cache';

// Initialize cache with a TTL of 30 days (in seconds)
const cache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60 });

async function fetchFanfictionData(url) {
    if (!url) {
        throw new Error('URL is required');
    }

    const cacheKey = `bookmark_data_fanfiction_${Buffer.from(url).toString('base64')}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`https://fichub.net/api/v0/meta?q=${encodedUrl}`, {
        method: 'GET',
        headers: {
            'User-Agent': 'TWENTY7',
            'Authorization': `Bearer ${import.meta.env.FICHUB_API_TOKEN}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const i = await response.json();
    const img = i.rawExtendedMeta.cimage ? `https://www.fanfiction.net${i.rawExtendedMeta.cimage}` : null;

    const data = {
        source: i.source,
        site: 'FanFiction.net',
        title: i.title,
        date: i.rawExtendedMeta.published,
        subtitle: null,
        author: i.author,
        excerpt: i.description.replace(/<[^>]+>/g, ''),
        thumbnail: img,
        icon: 'https://www.fanfiction.net/static/icons3/ff-icon-192.png'
    };

    const transientValue = JSON.stringify(data);
    cache.set(cacheKey, transientValue);

    return data;
}

export { fetchFanfictionData };
