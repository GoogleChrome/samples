export type Values = Record<string, any> | any[];
export default function<T extends Values>(template: string, values: T): string;
