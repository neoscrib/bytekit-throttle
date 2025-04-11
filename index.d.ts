declare module "@bytekit/autofetch" {
  export import ThrottledQueue = ByteKit.Throttle.ThrottledQueue;
  export import ThrottledPromiseQueue = ByteKit.Throttle.ThrottledPromiseQueue;
}

declare namespace ByteKit {
  export namespace Throttle {
    export type MaybePromise<T> = T | Promise<T>;

    /**
     * A throttled queue for executing fire-and-forget tasks (no return value).
     */
    export class ThrottledQueue {
      /**
       * @param maxTasks Maximum tasks allowed per time window
       * @param windowSize Time window in milliseconds
       * @param maxQueueSize Optional max queue size before rejecting tasks
       */
      constructor(maxTasks: number, windowSize: number, maxQueueSize?: number);

      /**
       * Enqueue a void-returning task to be executed according to throttling rules.
       * @throws Error if the queue is full
       */
      enqueue(task: () => void): void;
    }

    /**
     * A throttled queue for submitting promise-returning or sync functions and receiving their results.
     */
    export class ThrottledPromiseQueue extends ThrottledQueue {
      /**
       * @param maxTasks Maximum tasks allowed per time window
       * @param windowSize Time window in milliseconds
       * @param maxQueueSize Optional max queue size before rejecting tasks
       */
      constructor(maxTasks: number, windowSize: number, maxQueueSize?: number);

      /**
       * Submit a task returning a value or a promise of a value.
       * The result is resolved/rejected when the task completes.
       * @throws Error if the queue is full
       */
      submit<T>(task: () => MaybePromise<T>): Promise<T>;
    }
  }
}
