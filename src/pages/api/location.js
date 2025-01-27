export const prerender = false;

export const GET = async () => {
    const response = await fetch(`https://api.crossrambles.com/v1/location`, {
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