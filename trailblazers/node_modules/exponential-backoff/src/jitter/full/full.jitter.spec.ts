import { fullJitter } from './full.jitter';

describe(`Testing ${fullJitter.name}`, () => {
    const delay = 100;
    
    function arrayWith5FullJitterDelays() {
        return Array(5).fill(delay).map(fullJitter)
    }

    describe(`when calling #fullJitter on the same delay multiple times`, () => {
        it('all the delays are greater than or equal to 0', () => {
            arrayWith5FullJitterDelays()
            .forEach(value => expect(value).toBeGreaterThanOrEqual(0));
        })

        it('all the delays are less than or equal to the original delay', () => {
            arrayWith5FullJitterDelays()
            .forEach(value => expect(value).toBeLessThanOrEqual(delay));
        })

        it('the delays are not equal to one another', () => {
            const delays = arrayWith5FullJitterDelays();
            expect(new Set(delays).size).not.toBe(1);
        })

        it('the delays are integers', () => {
            arrayWith5FullJitterDelays()
            .forEach(value => expect(Number.isInteger(value)).toBe(true))
        })
    })
})