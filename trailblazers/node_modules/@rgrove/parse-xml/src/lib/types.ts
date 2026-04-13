export type JsonObject = {[key in string]?: JsonValue};
export type JsonValue = string | number | boolean | JsonObject | JsonValue[] | null;
