import { bookshelfQuery } from "../../lib/api.js";

export const prerender = false;

export const GET = async () => {
    const { bookshelf } = await bookshelfQuery();

    return new Response(
        JSON.stringify(bookshelf.nodes), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}