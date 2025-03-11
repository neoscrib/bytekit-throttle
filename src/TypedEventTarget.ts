export default class TypedEventTarget<T extends Record<string, Event>> extends EventTarget {
  public addEventListener<K extends keyof T>(
    type: K,
    listener: null | EventListenerObject | ((event: T[K]) => void),
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type as string, listener as EventListener, options);
  }

  public removeEventListener<K extends keyof T>(
    type: K,
    listener: null | EventListenerObject | ((event: T[K]) => void),
    options?: boolean | EventListenerOptions
  ): void {
    super.removeEventListener(type as string, listener as EventListener, options);
  }

  public dispatchEvent<K extends keyof T>(event: T[K]): boolean {
    return super.dispatchEvent(event);
  }
}