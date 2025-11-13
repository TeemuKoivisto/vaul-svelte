import * as React from "react";
import { Dialog } from "@radix-ui/react-dialog";

import { writable } from "../../svelte-store";
import { createVaul } from "../../internal/vaul";
import { DrawerContext } from "../ctx";

import type { Props } from "./types";
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
	const open = React.useMemo(() => controlledOpen ?? internalOpen, [controlledOpen, internalOpen]);

	const handleOpenChange: ChangeFn<boolean> = React.useCallback(({ next }) => {
		if (open !== next) {
			onOpenChange?.(next);
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
			// Ensure internal engine receives the correct direction and options
			direction,
			dismissible,
			fadeFromIndex: props.fadeFromIndex === undefined ? (undefined as never) : props.fadeFromIndex,
			snapPoints: snapPoints as any,
			onOpenChange: handleOpenChange,
			onActiveSnapPointChange: handleActiveSnapPointChange,
			activeListeners,
		}),
		[props, direction, dismissible, snapPoints, activeSnapPoint]
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
				// Keep internal state in sync for uncontrolled usage
				setInternalOpen(o);
				if (o) {
					vaul.methods.openDrawer();
				} else {
					vaul.methods.closeDrawer();
				}
			}}
			// onInteractOutside={(e) => {
			// 	// Surface outside-click to consumer and optionally prevent close
			// 	// @ts-expect-error: Radix event type
			// 	onOutsideClick?.(e);
			// 	if (!closeOnOutsideClick) {
			// 		e.preventDefault();
			// 	}
			// }}
			{...props}
		>
			<DrawerContext.Provider value={vaul}>{children}</DrawerContext.Provider>
		</Dialog>
	);
}
