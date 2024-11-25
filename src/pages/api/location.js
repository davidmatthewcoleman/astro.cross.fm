export const prerender = false;

export const GET = async () => {
    const response = await fetch(`https://cross.fm/wp-json/wp/v2/location`, {
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