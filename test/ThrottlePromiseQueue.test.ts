import {describe, it, expect, vi} from "vitest";
import ThrottledPromiseQueue from "../src/ThrottledPromiseQueue";

describe("ThrottledPromiseQueue", () => {
  it("resolves synchronous results", async () => {
    const queue = new ThrottledPromiseQueue(1, 1000);
    const result = await queue.submit(() => 42);
    expect(result).toBe(42);
  });

  it("resolves asynchronous results", async () => {
    const queue = new ThrottledPromiseQueue(1, 1000);
    const result = await queue.submit(async () => {
      await new Promise((r) => setTimeout(r, 10));
      return "hello";
    });
    expect(result).toBe("hello");
  });

  it("rejects when the task throws", async () => {
    const queue = new ThrottledPromiseQueue(1, 1000);
    await expect(
      queue.submit(() => {
        throw new Error("boom");
      })
    ).rejects.toThrow("boom");
  });

  it("rejects when the task returns a rejected promise", async () => {
    const queue = new ThrottledPromiseQueue(1, 1000);
    await expect(
      queue.submit(() => Promise.reject(new Error("fail")))
    ).rejects.toThrow("fail");
  });

  it("rejects if the queue is full", async () => {
    const queue = new ThrottledPromiseQueue(1, 1000, 0); // no queueing allowed
    queue.submit(() => new Promise(() => {})); // long-running task
    await expect(queue.submit(() => 123)).rejects.toThrow(
      "Queue limit reached, dropping task!"
    ); // should fail to enqueue
  });

  it("respects throttling limits", async () => {
    vi.useFakeTimers();
    const queue = new ThrottledPromiseQueue(2, 1000);

    const callTimes: number[] = [];
    const submitTime = Date.now();

    const submitTask = (n: number) =>
      queue.submit(() => {
        callTimes.push(Date.now() - submitTime);
        return `ok ${n}`;
      });

    // 5 tasks, only 2 per 1000ms
    const promises = [1, 2, 3, 4, 5].map(submitTask);

    // Fast-forward time to allow tasks to run
    vi.advanceTimersByTime(3000);

    const results = await Promise.all(promises);
    expect(results).toEqual(["ok 1", "ok 2", "ok 3", "ok 4", "ok 5"]);
    expect(callTimes.length).toBe(5);
    // Check that executions are spaced by ~1000ms/2
    expect(Math.max(...callTimes)).toBeGreaterThanOrEqual(2000);

    vi.useRealTimers();
  });
});
