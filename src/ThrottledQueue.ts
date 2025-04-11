import ExpiringList from "./ExpiringList.ts";

export default class ThrottledQueue {
  private readonly list: ExpiringList<Function>;
  private readonly queue: Function[] = [];

  public constructor(
    private readonly maxTasks: number,
    private readonly windowSize: number,
    private readonly maxQueueSize = 1000
  ) {
    this.list = new ExpiringList(windowSize);
    this.list.addEventListener("item-removed", () => {
      const task = this.queue.shift();
      if (task) {
        this.run(task);
      }
    });
  }

  public enqueue(task: Function) {
    if (this.list.size < this.maxTasks) {
      this.run(task);
    } else {
      if (this.queue.length < this.maxQueueSize) {
        this.queue.push(task);
      } else {
        throw new Error("Queue limit reached, dropping task!");
      }
    }
  }

  private async run(task: Function) {
    this.list.add(task);
    try {
      await task();
    } catch (error) {
      console.error("Task execution error: ", error);
    }
  }
}
