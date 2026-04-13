import { AlwaysDelay } from "./always.delay";
import { IBackOffOptions, getSanitizedOptions } from "../../options";

describe(AlwaysDelay.name, () => {
  let options: IBackOffOptions;
  let delay: AlwaysDelay;

  function initClass() {
    delay = new AlwaysDelay(options);
  }

  beforeEach(() => {
    options = getSanitizedOptions({});
    initClass();
    jest.useFakeTimers();
  });

  it(`when calling #apply, the delay is equal to the starting delay`, async () => {
    const spy = jest.fn();
    delay.apply().then(spy);
    jest.runTimersToTime(options.startingDelay);
    await Promise.resolve();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(`when the attempt number is 1, when calling #apply,
  the delay is equal to the starting delay multiplied by the time multiple`, async () => {
    delay.setAttemptNumber(1);

    const spy = jest.fn();
    delay.apply().then(spy);
    jest.runTimersToTime(options.startingDelay * options.timeMultiple);
    await Promise.resolve();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(`when the attempt number is 2, when calling #apply,
  the delay is equal to the starting delay multiplied by the time multiple raised by the attempt number`, async () => {
    const attemptNumber = 2;
    delay.setAttemptNumber(attemptNumber);

    const spy = jest.fn();
    delay.apply().then(spy);
    jest.runTimersToTime(
      options.startingDelay * Math.pow(options.timeMultiple, attemptNumber)
    );
    await Promise.resolve();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it(`when the #maxDelay is less than #startingDelay, when calling #apply,
  the delay is equal to the #maxDelay`, async () => {
    options.maxDelay = options.startingDelay - 1;

    const spy = jest.fn();
    delay.apply().then(spy);
    jest.runTimersToTime(options.maxDelay);
    await Promise.resolve();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
