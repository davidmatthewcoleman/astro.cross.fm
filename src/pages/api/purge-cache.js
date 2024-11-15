export const prerender = false;

export const GET = async ({ request }) => {
    const { method, headers } = request;
    const expectedSecret = import.meta.env.WEBHOOK_SECRET;
    const receivedSecret = headers['x-webhook-secret'];

    // Validate the webhook secret
    if (receivedSecret !== expectedSecret) {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized.' }));
    } else {
        const CLOUDFLARE_ZONE_ID = '5e42fc34c39fd8229aa1d8e8bc250127';
        const CLOUDFLARE_API_TOKEN = 'EYXu87ADPZ0d23e4wwQPRaK6QIq98cCxCOu4_qdt';

        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
            },
            body: JSON.stringify({ purge_everything: true })
        });

        const data = await response.json();

        if (data.success) {
            return new Response(JSON.stringify({ success: true, message: 'Cache purged successfully.' }));
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Failed to purge cache.', errors: data.errors }));
        }
    }

    return;
}
