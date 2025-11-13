import * as React from "react";
import type { DrawerDirection } from "../internal/types";
// import type { CreateVaulProps } from "../internal/vaul";
import type { Writable } from "../svelte-store";

// original
// export type CreateVaulProps = {
// 	defaultActiveSnapPoint?: number | string | null;
// 	onActiveSnapPointChange?: ChangeFn<number | string | null>;
// 	defaultOpen?: boolean;
// 	onOpenChange?: ChangeFn<boolean>;
// 	closeThreshold?: number;
// 	shouldScaleBackground?: boolean;
// 	backgroundColor?: string;
// 	scrollLockTimeout?: number;
// 	fixed?: boolean;
// 	dismissible?: boolean;
// 	direction?: DrawerDirection;
// 	onDrag?: (
// 		event: SvelteEvent<PointerEvent | TouchEvent, HTMLElement>,
// 		percentageDragged: number
// 	) => void;
// 	onRelease?: (
// 		event: SvelteEvent<PointerEvent | MouseEvent | TouchEvent, HTMLElement>,
// 		open: boolean
// 	) => void;
// 	modal?: boolean;
// 	nested?: boolean;
// 	onClose?: () => void;
// } & (WithFadeFromProps | WithoutFadeFromProps);

// export type DrawerContextValue = {
// 	drawerRef: React.RefObject<HTMLDivElement | null>;
// 	overlayRef: React.RefObject<HTMLDivElement | null>;
// 	triggerRef: React.RefObject<HTMLButtonElement | null>;
// 	isOpen: boolean;
// 	visible: boolean;
// 	direction: DrawerDirection;
// 	closeDrawer: (withKeyboard?: boolean) => void;
// 	openDrawer: () => void;
// 	onPress: (event: React.PointerEvent<HTMLElement>) => void;
// 	onDrag: (event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
// 	onRelease: (
// 		event:
// 			| React.PointerEvent<HTMLElement>
// 			| React.MouseEvent<HTMLElement>
// 			| React.TouchEvent<HTMLElement>
// 	) => void;
// 	getContentStyle: (style?: string | null) => string;
// 	snapPoints?: (number | string)[];
// 	shouldFade: boolean;
// 	keyboardIsOpen: boolean;
// 	activeListeners: Writable<Set<() => void>>;
// 	onNestedDrag?: (
// 		event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
// 		percentageDragged: number
// 	) => void;
// 	onNestedOpenChange?: (open: boolean) => void;
// 	onNestedRelease?: (
// 		event:
// 			| React.PointerEvent<HTMLElement>
// 			| React.MouseEvent<HTMLElement>
// 			| React.TouchEvent<HTMLElement>,
// 		open: boolean
// 	) => void;
// };
