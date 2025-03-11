export default function throttle<T extends (...args: any[]) => any>(
  func: T, 
  wait: number = 0, 
  {leading = true, trailing = true}: {leading?: boolean; trailing?: boolean} = {}
): T & {cancel: () => void} {
  let timer: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;
  let lastThis: any = null;
  let lastResult: ReturnType<T> | undefined;
  let lastCallTime: number | null = null;

  const invoke = () => {
    if (lastArgs) {
      lastResult = func.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    }
  };

  const throttled = function(this: any, ...args: any[]) {
    const now = Date.now();

    if (lastCallTime === null && !leading) {
      lastCallTime = now;
    }

    const remaining = wait - (now - (lastCallTime || 0));

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      lastResult = func.apply(this, args);
    } else if (trailing) {
      lastArgs = args;
      lastThis = this;

      if (!timer) {
        timer = setTimeout(() => {
          lastCallTime = leading ? Date.now() : null;
          timer = null;
          invoke();
        }, remaining);
      }
    }

    return lastResult;
  } as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = null;
    lastArgs = lastThis = null;
  };

  return throttled;
}
