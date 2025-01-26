import { fetchAllBooks } from "../../lib/fetch/bookshelf/all.js";
export const prerender = false;

export const GET = async ({request}) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');
    const bookshelf = await fetchAllBooks(page, pageSize);

    return new Response(
        JSON.stringify(bookshelf), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}