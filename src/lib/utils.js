import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}


export function formatInteger(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}