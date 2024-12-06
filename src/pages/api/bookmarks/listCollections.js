import { fetchRaindropUser } from "../../../lib/fetch/raindrop.js";
export const prerender = false;

export const GET = async () => {
    const data = await fetchRaindropUser();
    const output = data.user.groups.find(group => group.title === 'Bookmarks');

    return new Response(
        JSON.stringify(output), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}