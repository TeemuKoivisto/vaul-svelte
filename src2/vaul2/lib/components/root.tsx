import * as React from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DrawerProvider } from "../ctx";
import type { Props } from "./types";
import type { DrawerDirection } from "../../internal/types";
import { writable } from "../../svelte-store";

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
	const [internalOpen, setInternalOpen] = React.useState(controlledOpen ?? false);
	const [visible, setVisible] = React.useState(false);
	const drawerRef = React.useRef<HTMLDivElement>(null);
	const overlayRef = React.useRef<HTMLDivElement>(null);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);

	const open = controlledOpen ?? internalOpen;

	const handleOpenChange = React.useCallback(
		(newOpen: boolean) => {
			if (controlledOpen === undefined) {
				setInternalOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[controlledOpen, onOpenChange]
	);

	const closeDrawer = React.useCallback(
		(withKeyboard = false) => {
			handleOpenChange(false);
			if (withKeyboard) {
				triggerRef.current?.focus();
			}
		},
		[handleOpenChange]
	);

	const openDrawer = React.useCallback(() => {
		handleOpenChange(true);
	}, [handleOpenChange]);

	const onPress = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
		// Placeholder for drag functionality
	}, []);

	const onDrag = React.useCallback(
		(event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
			// Placeholder for drag functionality
		},
		[]
	);

	const onRelease = React.useCallback(
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

	const getContentStyle = React.useCallback((style?: string | null) => {
		return style || "";
	}, []);

	React.useEffect(() => {
		if (open) {
			// Set visible after mount for animation
			const timer = setTimeout(() => setVisible(true), 0);
			return () => clearTimeout(timer);
		} else {
			setVisible(false);
		}
	}, [open]);

	const handleOverlayMouseUp = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			onRelease(e);
		},
		[onRelease]
	);

	const activeListeners = React.useMemo(() => writable<Set<() => void>>(new Set()), []);

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
		activeListeners,
	};

	React.useEffect(() => {
		return () => {
			for (const fn of activeListeners.get()) {
				fn();
			}
		};
	}, []);

	// const vaul = createVaul(props);
	// const updateOption = getOptionUpdater(vaul.options);

	// setContext(VAUL_ROOT, { ...vaul, updateOption });

	// return {
	// 	...vaul,
	// 	updateOption,
	// };

	return (
		<Dialog open={open} onOpenChange={handleOpenChange} {...props}>
			<DrawerProvider value={contextValue}>{children}</DrawerProvider>
		</Dialog>
	);
}
