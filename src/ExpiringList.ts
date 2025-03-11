import TypedEventTarget from "./TypedEventTarget";

interface IExpiringListEventTargetMap<T> extends Record<string, Event> {
  "item-removed": CustomEvent<T>;
}

export default class ExpiringList<T> extends Set<T> implements TypedEventTarget<IExpiringListEventTargetMap<T>> {
  private readonly eventTarget = new TypedEventTarget<IExpiringListEventTargetMap<T>>();
  private readonly timers = new Map<T, NodeJS.Timeout>();

  /**
   * @param ttl Time-to-live in milliseconds
   */
  public constructor(private readonly ttl: number) {
    super();
  }

  add(value: T): this {
    super.add(value);
    this.timers.set(value, setTimeout(() => this.delete(value), this.ttl));
    return this;
  }

  delete(value: T): boolean {
    const result = super.delete(value);
    if (result) {
      clearTimeout(this.timers.get(value));
      this.dispatchEvent(new CustomEvent("item-removed", {detail: value}));
    }
    return result;
  }

  get addEventListener() {
    return this.eventTarget.addEventListener.bind(this.eventTarget);
  }

  get removeEventListener() {
    return this.eventTarget.removeEventListener.bind(this.eventTarget);
  }

  get dispatchEvent() {
    return this.eventTarget.dispatchEvent.bind(this.eventTarget);
  }
}