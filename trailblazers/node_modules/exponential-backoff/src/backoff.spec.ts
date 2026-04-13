import { backOff } from "./backoff";
import { BackoffOptions } from "./options";

describe("BackOff", () => {
  const mockSuccessResponse = { success: true };
  const mockFailResponse = { success: false };
  let backOffRequest: () => Promise<any>;
  let backOffOptions: BackoffOptions;

  function initBackOff() {
    return backOff(backOffRequest, backOffOptions);
  }

  function promiseThatIsResolved() {
    return () => Promise.resolve(mockSuccessResponse);
  }

  function promiseThatIsRejected() {
    return () => Promise.reject(mockFailResponse);
  }

  function promiseThatFailsOnceThenSucceeds() {
    return (() => {
      let firstAttempt = true;

      const request = () => {
        if (firstAttempt) {
          firstAttempt = false;
          return Promise.reject(mockFailResponse);
        }

        return Promise.resolve(mockSuccessResponse);
      };

      return request;
    })();
  }

  beforeEach(() => {
    backOffOptions = { startingDelay: 0 };
    backOffRequest = jest.fn(promiseThatIsResolved());
  });

  describe("when request function is a promise that resolves", () => {
    it("returns the resolved value", () => {
      const request = initBackOff();
      return request.then(response =>
        expect(response).toBe(mockSuccessResponse)
      );
    });

    it("calls the request function only once", () => {
      const request = initBackOff();
      return request.then(() =>
        expect(backOffRequest).toHaveBeenCalledTimes(1)
      );
    });

    it(`when the #backOffOptions.numOfAttempts is 0,
    it overrides the value and calls the method only once`, () => {
      backOffOptions.numOfAttempts = 0;
      const request = initBackOff();

      return request.then(() =>
        expect(backOffRequest).toHaveBeenCalledTimes(1)
      );
    });
  });

  describe(`when the #backOffOptions.startingDelay is 100ms`, () => {
    const startingDelay = 100;

    beforeEach(() => (backOffOptions.startingDelay = startingDelay));

    it(`does not delay the first attempt`, () => {
      const startTime = Date.now();
      const request = initBackOff();

      return request.then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const roundedDuration = Math.round(duration / 100) * 100;

        expect(roundedDuration).toBe(0);
      });
    });

    it(`when #backOffOptions.delayFirstAttempt is 'true',
    it delays the first attempt`, () => {
      backOffOptions.delayFirstAttempt = true;
      const startTime = Date.now();
      const request = initBackOff();

      return request.then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const roundedDuration = Math.round(duration / 100) * 100;

        expect(roundedDuration).toBe(startingDelay);
      });
    });
  });

  describe("when request function is a promise that is rejected", () => {
    beforeEach(() => (backOffRequest = promiseThatIsRejected()));

    it("returns the rejected value", () => {
      const request = initBackOff();
      return request.catch(err => expect(err).toBe(mockFailResponse));
    });

    it("retries the request as many times as specified in #BackOffOptions.numOfAttempts", async () => {
      const numOfAttemps = 2;
      backOffOptions.numOfAttempts = numOfAttemps;
      backOffRequest = jest.fn(() => Promise.reject(mockFailResponse));

      try {
        await initBackOff();
      } catch {
        expect(backOffRequest).toHaveBeenCalledTimes(numOfAttemps);
      }
    });

    it(`when the #BackOffOptions.retry function is set to always return false,
    it only calls request function one time`, async () => {
      backOffOptions.retry = () => false;
      backOffOptions.numOfAttempts = 2;
      backOffRequest = jest.fn(() => Promise.reject(mockFailResponse));

      try {
        await initBackOff();
      } catch {
        expect(backOffRequest).toHaveBeenCalledTimes(1);
      }
    });
  });

  it("when the #BackOffOptions.retry function returns a promise, it awaits it", async () => {
    const retryDuration = 100;
    backOffOptions.retry = () =>
      new Promise(resolve => setTimeout(() => resolve(true), retryDuration));
    backOffRequest = promiseThatFailsOnceThenSucceeds();

    const start = Date.now();
    await initBackOff();
    const end = Date.now();

    const duration = end - start;
    const roundedDuration =
      Math.round(duration / retryDuration) * retryDuration;

    expect(roundedDuration).toBe(retryDuration);
  });

  describe(`when calling #backOff with a function that throws an error the first time, and succeeds the second time`, () => {
    beforeEach(
      () => (backOffRequest = jest.fn(promiseThatFailsOnceThenSucceeds()))
    );

    it(`returns a successful response`, () => {
      const request = initBackOff();
      return request.then(response =>
        expect(response).toBe(mockSuccessResponse)
      );
    });

    it("calls the request function two times", async () => {
      await initBackOff();
      expect(backOffRequest).toHaveBeenCalledTimes(2);
    });

    it(`when setting the #BackOffOption.timeMultiple to a value,
    when setting the #BackOffOption.delayFirstAttempt to true,
    it applies a delay between the first and the second call`, async () => {
      const startingDelay = 100;
      const timeMultiple = 3;
      const totalExpectedDelay = startingDelay + timeMultiple * startingDelay;

      backOffOptions.startingDelay = startingDelay;
      backOffOptions.timeMultiple = timeMultiple;
      backOffOptions.delayFirstAttempt = true;

      const start = Date.now();
      await initBackOff();
      const end = Date.now();

      const duration = end - start;
      const roundedDuration =
        Math.round(duration / startingDelay) * startingDelay;

      expect(roundedDuration).toBe(totalExpectedDelay);
    });
  });
});
