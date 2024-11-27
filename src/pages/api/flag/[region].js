import fs from 'fs';
import path from 'path';

export const prerender = false; // Disable prerendering for dynamic endpoints

export async function GET({ request, params }) {
    // Extract 'region' from the path parameters
    const region = params.region; // This will be available in the request params

    if (!region) {
        return new Response("Region parameter is required", { status: 400 });
    }

    const directoryPath = path.join(process.cwd(), 'src/assets/flags');
    const filePath = path.join(directoryPath, `${region}.svg`);

    // Check if the requested flag file exists
    if (!fs.existsSync(filePath)) {
        return new Response("Flag not found", { status: 404 });
    }

    // Fetch or generate the flag data
    const flag = fs.readFileSync(filePath, 'utf8');

    // Return JSON response with flag data
    const data = {
        region,
        svg: flag, // Modify this to suit your `getFlag` implementation
    };

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
