export function fullJitter(delay: number) {
    const jitteredDelay = Math.random() * delay;
    return Math.round(jitteredDelay);
}