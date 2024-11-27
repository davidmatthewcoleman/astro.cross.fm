import fs from 'fs';
import path from 'path';

export const prerender = false; // Disable prerendering for dynamic endpoints

export async function GET({ request, params }) {
    // Extract 'name' from the path parameters
    const name = params.name; // This will be available in the request params

    if (!name) {
        return new Response("Name parameter is required", { status: 400 });
    }

    const directoryPath = path.join(process.cwd(), 'src/assets/icons');
    const filePath = path.join(directoryPath, `${name}.svg`);

    // Check if the requested flag file exists
    if (!fs.existsSync(filePath)) {
        return new Response("Icon not found", { status: 404 });
    }

    // Fetch or generate the flag data
    const icon = fs.readFileSync(filePath, 'utf8');

    // Return JSON response with flag data
    const data = {
        name,
        svg: icon, // Modify this to suit your `getFlag` implementation
    };

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
