import fetch from "node-fetch";
export const prerender = false;

export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`, {
        method: 'GET'
    });

    const { data } = await response.json();

    return new Response(
        JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}