import ThrottledQueue from "./ThrottledQueue.ts";

export type MaybePromise<T> = T | Promise<T>;

export default class ThrottledPromiseQueue extends ThrottledQueue {
  public submit<T>(fn: () => MaybePromise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        super.enqueue(async () => {
          try {
            const result = await fn();
            resolve(result);
          } catch (e) {
            reject(e);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}