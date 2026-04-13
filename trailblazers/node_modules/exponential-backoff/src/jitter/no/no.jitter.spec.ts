import { noJitter } from './no.jitter';

describe(`Testing ${noJitter.name}`, () => {
    it(`when calling #noJitter with a delay,
    it returns the same delay`, () => {
        const delay = 100;
        expect(noJitter(delay)).toBe(delay);
    })
})