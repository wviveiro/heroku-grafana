import {Operator} from '../Operator';
import {Subscriber} from '../Subscriber';
import {Observable} from '../Observable';

/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * <img src="./img/bufferCount.png" width="100%">
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * @example <caption>Emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2);
 * buffered.subscribe(x => console.log(x));
 *
 * @example <caption>On every click, emit the last two click events as an array</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var buffered = clicks.bufferCount(2, 1);
 * buffered.subscribe(x => console.log(x));
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
export function bufferCount<T>(bufferSize: number, startBufferEvery: number = null): Observable<T[]> {
  return this.lift(new BufferCountOperator<T>(bufferSize, startBufferEvery));
}

export interface BufferCountSignature<T> {
  (bufferSize: number, startBufferEvery?: number): Observable<T[]>;
}

class BufferCountOperator<T> implements Operator<T, T[]> {
  constructor(private bufferSize: number, private startBufferEvery: number) {
  }

  call(subscriber: Subscriber<T[]>): Subscriber<T> {
    return new BufferCountSubscriber(subscriber, this.bufferSize, this.startBufferEvery);
  }
}

class BufferCountSubscriber<T> extends Subscriber<T> {
  private buffers: Array<T[]> = [[]];
  private count: number = 0;

  constructor(destination: Subscriber<T[]>, private bufferSize: number, private startBufferEvery: number) {
    super(destination);
  }

  protected _next(value: T) {
    const count = (this.count += 1);
    const destination = this.destination;
    const bufferSize = this.bufferSize;
    const startBufferEvery = (this.startBufferEvery == null) ? bufferSize : this.startBufferEvery;
    const buffers = this.buffers;
    const len = buffers.length;
    let remove = -1;

    if (count % startBufferEvery === 0) {
      buffers.push([]);
    }

    for (let i = 0; i < len; i++) {
      const buffer = buffers[i];
      buffer.push(value);
      if (buffer.length === bufferSize) {
        remove = i;
        destination.next(buffer);
      }
    }

    if (remove !== -1) {
      buffers.splice(remove, 1);
    }
  }

  protected _complete() {
    const destination = this.destination;
    const buffers = this.buffers;
    while (buffers.length > 0) {
      let buffer = buffers.shift();
      if (buffer.length > 0) {
        destination.next(buffer);
      }
    }
    super._complete();
  }
}
