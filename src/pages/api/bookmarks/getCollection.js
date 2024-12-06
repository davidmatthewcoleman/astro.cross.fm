import { fetchRaindropCollection } from "../../../lib/fetch/raindrop.js";
export const prerender = false;

export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const data = await fetchRaindropCollection(id);

    return new Response(
        JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}