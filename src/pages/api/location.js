import {locationData} from "../../lib/api.js";

export const prerender = false;

export const GET = async () => {
    const { locationData: data } = await locationData();

    return new Response(
        JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}