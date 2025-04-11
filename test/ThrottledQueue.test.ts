import ThrottledQueue from "../src/ThrottledQueue";

describe("ThrottledQueue", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("throttles task execution", () => {
    const queue = new ThrottledQueue(10, 10000);

    // fill up queue and ensure all tasks are executed immediately
    for (let i = 0; i < 10; i++) {
      const task = vi.fn().mockImplementation(() => console.log(i));
      queue.enqueue(task);
      expect(task).toHaveBeenCalled();
    }

    // add more items, none of them should be executed immediately
    for (let i = 10; i < 20; i++) {
      const task = vi.fn().mockImplementation(() => console.log(i));
      queue.enqueue(task);
      expect(task).not.toHaveBeenCalled();
    }

    const finalTask = vi.fn().mockImplementation(() => console.log(20));
    queue.enqueue(finalTask);
    expect(finalTask).not.toHaveBeenCalled();

    for (let i = 0; i < 20; i++) {
      vi.advanceTimersByTime(1000);

      if (i < 19) {
        expect(finalTask).not.toHaveBeenCalled();
      } else {
        expect(finalTask).toHaveBeenCalled();
      }
    }
  });

  it("throws when exceeding max queue size with default maxQueueSize", () => {
    const queue = new ThrottledQueue(10, 10000);

    // fill up queue and ensure all tasks are executed immediately
    for (let i = 0; i < 10; i++) {
      const task = vi.fn().mockImplementation(() => console.log(i));
      queue.enqueue(task);
      expect(task).toHaveBeenCalled();
    }

    // add 1000 more items, none of them should be executed immediately
    for (let i = 0; i < 1000; i++) {
      const task = vi.fn().mockImplementation(() => console.log(i));
      queue.enqueue(task);
      expect(task).not.toHaveBeenCalled();
    }

    // add 1 more item, should throw
    const finalTask = vi.fn().mockImplementation(() => console.log(20));
    expect(() => queue.enqueue(finalTask)).toThrow(
      "Queue limit reached, dropping task!"
    );
  });

  it("throws when exceeding max queue size with custom maxQueueSize", () => {
    const queue = new ThrottledQueue(10, 10000, 100);

    // fill up queue and ensure all tasks are executed immediately
    for (let i = 0; i < 10; i++) {
      const task = vi.fn().mockImplementation(() => console.log(i));
      queue.enqueue(task);
      expect(task).toHaveBeenCalled();
    }

    // add 100 more items, none of them should be executed immediately
    for (let i = 0; i < 100; i++) {
      const task = vi.fn().mockImplementation(() => console.log(i));
      queue.enqueue(task);
      expect(task).not.toHaveBeenCalled();
    }

    // add 1 more item, should throw
    const finalTask = vi.fn().mockImplementation(() => console.log(20));
    expect(() => queue.enqueue(finalTask)).toThrow(
      "Queue limit reached, dropping task!"
    );
  });

  it("logs console error if a task fails", () => {
    const queue = new ThrottledQueue(10, 10000);
    const consoleErrorSpy = vi.spyOn(console, "error");

    queue.enqueue(() => {
      throw new Error("task failed");
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Task execution error: ",
      expect.objectContaining({message: "task failed"})
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Task execution error: ",
      expect.any(Error)
    );
  });
});
