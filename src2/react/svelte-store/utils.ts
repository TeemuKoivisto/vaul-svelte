export const noop = () => {};

export function safe_not_equal(a: unknown, b: unknown): boolean {
	return a != a
		? b == b
		: a !== b || (a !== null && typeof a === "object") || typeof a === "function";
}

export function run_all(arr: (() => void)[]) {
	for (let i = 0; i < arr.length; i++) {
		arr[i]();
	}
}
