export const get = (key: string) => (obj: any) => obj[key];
export const set = (key: string) => <T>(obj: T, value: any): T => ({ ...(<any>obj), [key]: value });

export const keys = Object.keys;
export const values = (obj: any): any[] => keys(obj).map((key) => obj[key]);
