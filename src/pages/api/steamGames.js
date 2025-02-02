import { fetchSteamGames } from "../../lib/steam.js";

export const prerender = false;

export async function GET({request}) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    try {
        const { response } = await fetchSteamGames();

        if ( id ) {
            const output = response.games.find(game => game.appid === parseInt(id, 10));
            return new Response(JSON.stringify(output), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } else {
            return new Response(JSON.stringify(response), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

    } catch (error) {
        console.error("Error fetching games:", error);
        return new Response({ message: "An error occurred while fetching games." }, {
            status: 500,
            statusText: "Something went wrong",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
