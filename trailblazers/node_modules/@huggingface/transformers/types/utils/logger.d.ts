export namespace logger {
    /**
     * Log an error message. Only suppressed when logLevel is NONE.
     * @param  {...any} args - Arguments to log
     */
    function error(...args: any[]): void;
    /**
     * Log a warning message. Shown when logLevel <= WARNING.
     * @param  {...any} args - Arguments to log
     */
    function warn(...args: any[]): void;
    /**
     * Log an info message. Shown when logLevel <= INFO.
     * @param  {...any} args - Arguments to log
     */
    function info(...args: any[]): void;
    /**
     * Log a debug message. Only shown when logLevel is DEBUG.
     * @param  {...any} args - Arguments to log
     */
    function debug(...args: any[]): void;
    /**
     * Log a message (alias for info). Shown when logLevel <= INFO.
     * @param  {...any} args - Arguments to log
     */
    function log(...args: any[]): void;
}
//# sourceMappingURL=logger.d.ts.map