import throttle from "../src/throttle";

describe("throttle", () => {
  const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throttles a function", async () => {
    const func = vi.fn();
    const throttled = throttle(func, 32);

    throttled();
    throttled();
    throttled();

    expect(func).toHaveBeenCalledOnce();

    await wait(64);
    expect(func).toHaveBeenCalledTimes(2);
  });

  it("subsequent calls should return the result of the first call", async () => {
    const throttled = throttle((x: string) => x, 32);
    let results = [throttled("a"), throttled("b")];
    expect(results).toEqual(["a", "a"]);

    await wait(64);
    results = [throttled("c"), throttled("d")];
    expect(results).toEqual(["c", "c"]);
  });

  it("should not trigger a trailing call when invoked once", async () => {
    const func = vi.fn();
    const throttled = throttle(func, 32);
    throttled();

    expect(func).toHaveBeenCalledOnce();
    await wait(64);
    expect(func).toHaveBeenCalledOnce();
  });

  [0, 1].forEach((index) => {
    it(`should trigger a call when invoked repeatedly${index ? ' and `leading` is `false`' : ''}`, () => {
      let limit = 320;
      const func = vi.fn();
      const options = index ? {leading: false} : {};
      const throttled = throttle(func, 32, options);

      const start = Date.now();
      while ((Date.now() - start) < limit) {
        throttled();
      }

      expect(func.mock.calls.length).toBeGreaterThan(1);
    });
  });

  it("should trigger a second throttled call as soon as possible", async () => {
    const func = vi.fn();
    const throttled = throttle(func, 128, {leading: false});
    throttled();

    await Promise.all([
      wait(192).then(() => {
        expect(func).toHaveBeenCalledOnce();
        throttled();
      }),

      wait(254).then(() => {
        expect(func).toHaveBeenCalledOnce();
      }),

      wait(384).then(() => {
        expect(func).toHaveBeenCalledTimes(2);
      })
    ]);
  });
});