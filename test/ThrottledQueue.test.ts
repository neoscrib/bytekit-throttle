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

    const finalTask = vi.fn().mockImplementation(() => console.log(20));;
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
});