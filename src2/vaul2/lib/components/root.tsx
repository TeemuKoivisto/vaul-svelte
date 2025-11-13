import * as React from "react";
import { Dialog } from "@radix-ui/react-dialog";

import { writable } from "../../svelte-store";
import { createVaul } from "../../internal/vaul";
import { DrawerProvider } from "../ctx";

import type { Props } from "./types";
import type { DrawerDirection } from "../../internal/types";
import type { ChangeFn } from "../../internal/helpers";

export function DrawerRoot({
	open: controlledOpen,
	onOpenChange,
	onActiveSnapPointChange,
	direction = "bottom",
	dismissible = true,
	closeOnOutsideClick = true,
	onOutsideClick,
	children,
	snapPoints,
	activeSnapPoint,
	...props
}: Props) {
	const [internalOpen, setInternalOpen] = React.useState(controlledOpen ?? false);
	// const [visible, setVisible] = React.useState(false);
	// const drawerRef = React.useRef<HTMLDivElement>(null);
	// const overlayRef = React.useRef<HTMLDivElement>(null);
	// const triggerRef = React.useRef<HTMLButtonElement>(null);
	// const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);

	const open = React.useMemo(() => controlledOpen ?? internalOpen, [controlledOpen, internalOpen]);

	// const closeDrawer = React.useCallback(
	// 	(withKeyboard = false) => {
	// 		handleOpenChange(false);
	// 		if (withKeyboard) {
	// 			triggerRef.current?.focus();
	// 		}
	// 	},
	// 	[handleOpenChange]
	// );

	// const openDrawer = React.useCallback(() => {
	// 	handleOpenChange(true);
	// }, [handleOpenChange]);

	// const getContentStyle = React.useCallback((style?: string | null) => {
	// 	return style || "";
	// }, []);

	// const handleOverlayMouseUp = React.useCallback(
	// 	(e: React.MouseEvent<HTMLDivElement>) => {
	// 		onRelease(e);
	// 	},
	// 	[onRelease]
	// );

	// const contextValue = {
	// 	drawerRef,
	// 	overlayRef,
	// 	triggerRef,
	// 	isOpen: open,
	// 	visible,
	// 	direction,
	// 	closeDrawer,
	// 	openDrawer,
	// 	onPress,
	// 	onDrag,
	// 	onRelease,
	// 	getContentStyle,
	// 	shouldFade: true,
	// 	keyboardIsOpen,
	// 	snapPoints: undefined,
	// 	activeListeners,
	// };

	// const handleOpenChange = React.useCallback(
	// 	(newOpen: boolean) => {
	// 		if (controlledOpen === undefined) {
	// 			setInternalOpen(newOpen);
	// 		}
	// 		onOpenChange?.(newOpen);
	// 	},
	// 	[controlledOpen, onOpenChange]
	// );

	const handleOpenChange: ChangeFn<boolean> = React.useCallback(({ next }) => {
		if (open !== next) {
			onOpenChange?.(next);
			// open = next;
			setInternalOpen(next);
		}
		return next;
	}, []);

	const handleActiveSnapPointChange: ChangeFn<string | number | null> = React.useCallback(
		({ next }) => {
			if (next === undefined && snapPoints && activeSnapPoint !== next) {
				const newNext = snapPoints[0];
				onActiveSnapPointChange?.(newNext);
				activeSnapPoint = newNext;
				return newNext;
			}

			if (activeSnapPoint !== next) {
				onActiveSnapPointChange?.(next);
				activeSnapPoint = next;
			}
			return next;
		},
		[snapPoints, activeSnapPoint, onActiveSnapPointChange]
	);

	const activeListeners = React.useMemo(() => writable<Set<() => void>>(new Set()), []);
	// const updateOption = getOptionUpdater(vaul.options);
	// setContext(VAUL_ROOT, { ...vaul, updateOption });
	const extendedProps = React.useMemo(
		() => ({
			...props,
			fadeFromIndex: props.fadeFromIndex === undefined ? (undefined as never) : props.fadeFromIndex,
			snapPoints: snapPoints as any,
			onOpenChange: handleOpenChange,
			onActiveSnapPointChange: handleActiveSnapPointChange,
			activeListeners,
		}),
		[props]
	);

	const vaul = createVaul(extendedProps);

	React.useEffect(() => {
		return () => {
			for (const fn of activeListeners.get()) {
				fn();
			}
		};
	}, []);

	React.useEffect(() => {
		if (open) {
			// Set visible after mount for animation
			const timer = setTimeout(() => vaul.states.visible.set(true), 0);
			return () => clearTimeout(timer);
		} else {
			vaul.states.visible.set(false);
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				onOpenChange?.(o);
				if (!o) {
					vaul.methods.closeDrawer();
				} else if (o) {
					vaul.methods.openDrawer();
				}
			}}
			{...props}
		>
			<DrawerProvider value={vaul}>{children}</DrawerProvider>
		</Dialog>
	);
}
