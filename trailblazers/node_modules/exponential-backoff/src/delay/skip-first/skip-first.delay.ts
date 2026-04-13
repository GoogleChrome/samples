import { Delay } from "../delay.base";

export class SkipFirstDelay extends Delay {
    public async apply() {
        return this.isFirstAttempt ? true : super.apply();
    }

    private get isFirstAttempt() {
        return this.attempt === 0;
    }

    protected get numOfDelayedAttempts() {
        return this.attempt - 1;
    }
}