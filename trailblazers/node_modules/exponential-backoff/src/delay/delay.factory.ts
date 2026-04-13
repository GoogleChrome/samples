import { IBackOffOptions } from "../options";
import { SkipFirstDelay } from "./skip-first/skip-first.delay";
import { AlwaysDelay } from "./always/always.delay";
import { IDelay } from "./delay.interface";

export function DelayFactory(options: IBackOffOptions, attempt: number): IDelay {
    const delay = initDelayClass(options);
    delay.setAttemptNumber(attempt);
    return delay;
}

function initDelayClass(options: IBackOffOptions) {
    if (!options.delayFirstAttempt) {
        return new SkipFirstDelay(options);
    }

    return new AlwaysDelay(options);
}