import { fetchAllBooks } from "../../lib/fetch/bookshelf/all.js";
export const prerender = false;

export const GET = async () => {
    const bookshelf = await fetchAllBooks();

    return new Response(
        JSON.stringify(bookshelf), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}