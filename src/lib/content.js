import { promises as fs } from 'fs';
import path from 'path';

export const things = async () => {
    const filePath = path.resolve(process.cwd(), 'src', 'content/json/things.json');
    const file = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(file);
    return data;
};