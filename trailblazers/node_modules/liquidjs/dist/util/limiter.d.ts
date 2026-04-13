export declare class Limiter {
    private message;
    private base;
    private limit;
    constructor(resource: string, limit: number);
    use(count: number): void;
    check(count: number): void;
}
