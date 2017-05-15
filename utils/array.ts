export const first = <T = any>(array: T[] | null): T | undefined => array ? array[0] : undefined;
export const last = <T = any>(array: T[] | null): T | undefined => array ? array[array.length - 1] : undefined;
