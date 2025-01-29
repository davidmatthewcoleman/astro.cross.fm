export const prerender = false;

export const GET = async ({request}) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
        return new Response(
            JSON.stringify({ error: "Missing slug parameter" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const response = await fetch(`https://counterapi.com/api/${import.meta.COUNT_API_NAMESPACE}/view/${slug}`, {
        method: 'GET'
    });

    const data = await response.json();

    return new Response(
        JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}
