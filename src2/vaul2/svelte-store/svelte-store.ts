import type {
	Readable,
	StartStopNotifier,
	Subscriber,
	Unsubscriber,
	Updater,
	Writable,
} from "./svelte-types";
import { noop, run_all, safe_not_equal } from "./utils";

/**
 * This whole code is based on a stripped down version of svelte/store
 * https://github.com/sveltejs/svelte/blob/d47f4f59084a26d8b47d864e961ddf76336a0ed8/packages/svelte/src/store/shared/index.js
 */

/** Pair of subscriber and invalidator. */
type SubscribeInvalidateTuple<T> = [Subscriber<T>, () => void];

/** One or more `Readable`s. */
export type Stores =
	| Readable<any>
	| [Readable<any>, ...Array<Readable<any>>]
	| Array<Readable<any>>;

/** One or more values from `Readable` stores. */
export type StoresValues<T> =
	T extends Readable<infer U> ? U : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

const subscriber_queue: (SubscribeInvalidateTuple<any> | any)[] = [];

/**
 * Creates a `Readable` store that allows reading by subscription.
 *
 * @template T
 * @param {T} [value] initial value
 * @param {StartStopNotifier<T>} [start]
 * @returns {Readable<T>}
 */
export function readable<T>(value: T, start: StartStopNotifier<T>): Readable<T> {
	const w = writable(value, start);
	return {
		get: w.get,
		subscribe: w.subscribe,
	};
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * @template T
 * @param {T} [value] initial value
 * @param {StartStopNotifier<T>} [start]
 * @returns {Writable<T>}
 */
export function writable<T = any>(value: T, start: StartStopNotifier<T> = noop): Writable<T> {
	let stop: Unsubscriber | null = null;
	const subscribers = new Set<SubscribeInvalidateTuple<T>>();

	function get() {
		return value;
	}

	function set(new_value: T) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

	function update(fn: (val: T) => T) {
		set(fn(value));
	}

	function subscribe(run: Subscriber<T>, invalidate: () => void = noop) {
		const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) {
			stop = start(set, update) || noop;
		}
		run(value);
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return { get, set, update, subscribe };
}

type Fn<S, T> =
	| ((
			values: StoresValues<S>,
			set: (value: T) => void,
			update: (fn: Updater<T>) => void
	  ) => Unsubscriber | void)
	| ((values: StoresValues<S>) => T);

export function derived<S extends Stores, T>(
	stores: S,
	fn: (values: StoresValues<S>) => T,
	initial_value?: T
): Readable<T> {
	const single = !Array.isArray(stores);
	const stores_array = (single ? [stores] : stores) as Readable<any>[];
	if (!stores_array.every(Boolean)) {
		throw new Error("derived() expects stores as input, got a falsy value");
	}
	const auto = fn.length < 2;
	if (!initial_value) {
		const initialValues = stores_array.map((s) => s.get());
		initial_value = fn(single ? initialValues[0] : initialValues);
	}
	return readable(initial_value, (set, update) => {
		let started = false;
		const values: T[] = [];
		let pending = 0;
		let cleanup: Function = noop;
		const sync = () => {
			if (pending) {
				return;
			}
			cleanup();
			const result = fn((single ? values[0] : values) as unknown as StoresValues<S>);
			if (auto) {
				set(result);
			} else {
				cleanup = typeof result === "function" ? result : noop;
			}
		};
		const unsubscribers = stores_array.map((store, i) =>
			store.subscribe(
				(value) => {
					values[i] = value;
					pending &= ~(1 << i);
					if (started) {
						sync();
					}
					return () => {};
				},
				() => {
					pending |= 1 << i;
				}
			)
		);

		started = true;
		sync();
		return function stop() {
			run_all(unsubscribers);
			cleanup();
			// We need to set this to false because callbacks can still happen despite having unsubscribed:
			// Callbacks might already be placed in the queue which doesn't know it should no longer
			// invoke this derived store.
			started = false;
		};
	});
}
