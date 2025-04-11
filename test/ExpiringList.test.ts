import {describe, it, expect, vi, beforeEach} from "vitest";
import ExpiringList from "../src/ExpiringList";

describe("ExpiringList", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds items and they are accessible", () => {
    const list = new ExpiringList<number>(1000);
    list.add(42);
    expect(list.has(42)).toBe(true);
  });

  it("removes items manually and dispatches event", () => {
    const list = new ExpiringList<string>(1000);
    const spy = vi.fn();
    list.addEventListener("item-removed", spy);

    list.add("foo");
    const removed = list.delete("foo");

    expect(removed).toBe(true);
    expect(list.has("foo")).toBe(false);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail).toBe("foo");
  });

  it("automatically removes items after TTL", () => {
    const list = new ExpiringList<number>(500);
    const spy = vi.fn();
    list.addEventListener("item-removed", spy);

    list.add(123);
    expect(list.has(123)).toBe(true);

    vi.advanceTimersByTime(500);

    expect(list.has(123)).toBe(false);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy.mock.calls[0][0].detail).toBe(123);
  });

  it("does not dispatch event if delete() is called on non-existent item", () => {
    const list = new ExpiringList<number>(1000);
    const spy = vi.fn();
    list.addEventListener("item-removed", spy);

    const removed = list.delete(999);
    expect(removed).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });
});
