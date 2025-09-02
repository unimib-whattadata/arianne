export function once<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  context?: unknown,
) {
  let result: ReturnType<T>;
  let called = false;
  return function (this: T, ...args: Parameters<T>): ReturnType<T> {
    if (called) return result;
    called = true;
    if (fn) {
      result = fn.apply(context || this, args);
      fn = null as unknown as T;
    }
    return result;
  };
}
