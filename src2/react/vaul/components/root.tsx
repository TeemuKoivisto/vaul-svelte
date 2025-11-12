"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DrawerProvider } from "../ctx";
import type { Props } from "./types";
import type { DrawerDirection } from "../../internal/types";

export function DrawerRoot({
	open: controlledOpen,
	onOpenChange,
	direction = "bottom",
	dismissible = true,
	closeOnOutsideClick = true,
	onOutsideClick,
	children,
	...props
}: Props) {
	const [internalOpen, setInternalOpen] = useState(controlledOpen ?? false);
	const [visible, setVisible] = useState(false);
	const drawerRef = useRef<HTMLDivElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);

	const open = controlledOpen ?? internalOpen;

	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			if (controlledOpen === undefined) {
				setInternalOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[controlledOpen, onOpenChange]
	);

	const closeDrawer = useCallback(
		(withKeyboard = false) => {
			handleOpenChange(false);
			if (withKeyboard) {
				triggerRef.current?.focus();
			}
		},
		[handleOpenChange]
	);

	const openDrawer = useCallback(() => {
		handleOpenChange(true);
	}, [handleOpenChange]);

	const onPress = useCallback((event: React.PointerEvent<HTMLElement>) => {
		// Placeholder for drag functionality
	}, []);

	const onDrag = useCallback(
		(event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
			// Placeholder for drag functionality
		},
		[]
	);

	const onRelease = useCallback(
		(
			event:
				| React.PointerEvent<HTMLElement>
				| React.MouseEvent<HTMLElement>
				| React.TouchEvent<HTMLElement>
		) => {
			// Placeholder for release functionality
		},
		[]
	);

	const getContentStyle = useCallback((style?: string | null) => {
		return style || "";
	}, []);

	useEffect(() => {
		if (open) {
			// Set visible after mount for animation
			const timer = setTimeout(() => setVisible(true), 0);
			return () => clearTimeout(timer);
		} else {
			setVisible(false);
		}
	}, [open]);

	const handleOverlayMouseUp = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			onRelease(e);
		},
		[onRelease]
	);

	const contextValue = {
		drawerRef,
		overlayRef,
		triggerRef,
		isOpen: open,
		visible,
		direction,
		closeDrawer,
		openDrawer,
		onPress,
		onDrag,
		onRelease,
		getContentStyle,
		shouldFade: true,
		keyboardIsOpen,
		snapPoints: undefined,
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...props}>
			<DrawerProvider value={contextValue}>{children}</DrawerProvider>
		</Dialog>
	);
}
