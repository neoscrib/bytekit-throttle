import {describe, it, expect, vi} from "vitest";
import TypedEventTarget from "../src/TypedEventTarget";

interface MyEvents extends Record<string, Event> {
  ping: CustomEvent<{message: string}>;
  pong: CustomEvent<number>;
}

describe("TypedEventTarget", () => {
  it("calls function listeners with correct event", () => {
    const target = new TypedEventTarget<MyEvents>();
    const handler = vi.fn();

    target.addEventListener("ping", handler);
    target.dispatchEvent(new CustomEvent("ping", {detail: {message: "hi"}}));

    expect(handler).toHaveBeenCalledOnce();
    const event = handler.mock.calls[0][0];
    expect(event.detail.message).toBe("hi");
  });

  it("calls object listeners with handleEvent method", () => {
    const target = new TypedEventTarget<MyEvents>();
    const listenerObj = {
      handleEvent: vi.fn()
    };

    target.addEventListener("pong", listenerObj);
    target.dispatchEvent(new CustomEvent("pong", {detail: 123}));

    expect(listenerObj.handleEvent).toHaveBeenCalledOnce();
    const event = listenerObj.handleEvent.mock.calls[0][0];
    expect(event.detail).toBe(123);
  });

  it("removes listeners correctly", () => {
    const target = new TypedEventTarget<MyEvents>();
    const handler = vi.fn();

    target.addEventListener("ping", handler);
    target.removeEventListener("ping", handler);
    target.dispatchEvent(new CustomEvent("ping", {detail: {message: "bye"}}));

    expect(handler).not.toHaveBeenCalled();
  });

  it("returns true from dispatchEvent if not canceled", () => {
    const target = new TypedEventTarget<MyEvents>();
    const result = target.dispatchEvent(
      new CustomEvent("ping", {detail: {message: "hello"}})
    );
    expect(result).toBe(true);
  });

  it("returns false from dispatchEvent if event is canceled", () => {
    const target = new TypedEventTarget<MyEvents>();

    target.addEventListener("ping", (e) => {
      e.preventDefault();
    });

    const event = new CustomEvent("ping", {
      detail: {message: "cancel me"},
      cancelable: true
    });

    const result = target.dispatchEvent(event);
    expect(result).toBe(false);
  });
});
