import {fetchUptime} from "../../lib/fetch/uptime.js";

export const prerender = false;

export const GET = async () => {
    const { data } = await fetchUptime();

    return new Response(
        JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}