import fetch from "node-fetch";
import UseEncryptedImage from "../../lib/fetch/encrypt.js";
export const prerender = false;

export const GET = async ({ request }) => {
    const url = new URL(request.url);
    const src = decodeURIComponent(url.searchParams.get('src'));

    const encryptedSource = await UseEncryptedImage(src);

    return new Response(
        JSON.stringify({
            data: encryptedSource
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}