// import type { Action } from 'svelte/action'

import type { Writable } from "../svelte-store";
import type { ChangeFn } from "./helpers";

export type SvelteEvent<T extends Event = Event, U extends EventTarget = EventTarget> = T & {
	currentTarget: EventTarget & U;
};

export type OnChangeFn<T> = (value: T) => void;

export type Arrayable<T> = T | T[];

export type Expand<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: O[K] }
		: never
	: T;

// export type Builder<
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   Element = any,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   Param = any,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   Attributes extends Record<string, any> = Record<string, any>
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// > = Record<string, any> & {
//   action: Action<Element, Param, Attributes>
// }

export type DrawerDirection = "left" | "right" | "top" | "bottom";

export type WithFadeFromProps = {
	snapPoints: (number | string)[];
	fadeFromIndex: number;
};

export type WithoutFadeFromProps = {
	snapPoints?: (number | string)[];
	fadeFromIndex?: never;
};

export type PressEvent = React.PointerEvent<HTMLElement>;
export type DragEvent =
	| React.MouseEvent<HTMLElement>
	| React.PointerEvent<HTMLElement>
	| React.TouchEvent<HTMLElement>;
export type ReleaseEvent =
	| React.MouseEvent<HTMLElement>
	| React.PointerEvent<HTMLElement>
	| React.TouchEvent<HTMLElement>;

export type CreateVaulProps = {
	defaultActiveSnapPoint?: number | string | null;
	onActiveSnapPointChange?: ChangeFn<number | string | null>;
	defaultOpen?: boolean;
	onOpenChange?: ChangeFn<boolean>;
	closeThreshold?: number;
	shouldScaleBackground?: boolean;
	backgroundColor?: string;
	scrollLockTimeout?: number;
	fixed?: boolean;
	dismissible?: boolean;
	direction?: DrawerDirection;
	onDrag?: (
		event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
		percentageDragged: number
	) => void;
	onRelease?: (
		event:
			| React.PointerEvent<HTMLElement>
			| React.MouseEvent<HTMLElement>
			| React.TouchEvent<HTMLElement>,
		open: boolean
	) => void;
	modal?: boolean;
	nested?: boolean;
	activeListeners: Writable<Set<() => void>>;
	onClose?: () => void;
} & (WithFadeFromProps | WithoutFadeFromProps);
