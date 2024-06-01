export function formatInteger(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}