import fetch from "node-fetch";
export const prerender = false;

export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');

    const response = await fetch(`https://webmention.io/api/mentions.jf2?target=${encodeURIComponent('https://crossrambles.com' + decodeURIComponent(path))}`, {
        method: 'GET'
    });

    const { children } = await response.json();

    return new Response(
        JSON.stringify(children), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}