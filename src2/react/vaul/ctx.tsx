import * as React from "react";
import type { DrawerDirection } from "../internal/types";
import type { CreateVaulProps } from "../internal/vaul";

type DrawerContextValue = {
	drawerRef: React.RefObject<HTMLDivElement | null>;
	overlayRef: React.RefObject<HTMLDivElement | null>;
	triggerRef: React.RefObject<HTMLButtonElement | null>;
	isOpen: boolean;
	visible: boolean;
	direction: DrawerDirection;
	closeDrawer: (withKeyboard?: boolean) => void;
	openDrawer: () => void;
	onPress: (event: React.PointerEvent<HTMLElement>) => void;
	onDrag: (event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void;
	onRelease: (
		event:
			| React.PointerEvent<HTMLElement>
			| React.MouseEvent<HTMLElement>
			| React.TouchEvent<HTMLElement>
	) => void;
	getContentStyle: (style?: string | null) => string;
	snapPoints?: (number | string)[];
	shouldFade: boolean;
	keyboardIsOpen: boolean;
	onNestedDrag?: (
		event: React.PointerEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
		percentageDragged: number
	) => void;
	onNestedOpenChange?: (open: boolean) => void;
	onNestedRelease?: (
		event:
			| React.PointerEvent<HTMLElement>
			| React.MouseEvent<HTMLElement>
			| React.TouchEvent<HTMLElement>,
		open: boolean
	) => void;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
	const context = React.useContext(DrawerContext);
	if (!context) {
		throw new Error("Drawer components must be used within a Drawer.Root");
	}
	return context;
}

export function DrawerProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: DrawerContextValue;
}) {
	return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}
