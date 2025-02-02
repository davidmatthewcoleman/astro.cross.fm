import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}


export function formatInteger(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function listToString(array) {
    if (array.length === 0) return '';
    if (array.length === 1) return array[0];

    const allButLast = array.slice(0, -1); // Gets all elements except the last
    const lastItem = array[array.length - 1]; // Gets the last element without modifying the array

    return `${allButLast.join(', ')} & ${lastItem}`;
}