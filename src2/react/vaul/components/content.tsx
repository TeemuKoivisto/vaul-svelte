import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useDrawerContext } from "../ctx";
import type { ContentProps } from "./types";
import "../../drawer.css";

export const DrawerContent = React.forwardRef<HTMLDivElement, ContentProps>(
	({ style, children, className, ...props }, ref) => {
		const { drawerRef, visible, direction, onPress, onDrag, onRelease, getContentStyle } =
			useDrawerContext();

		const combinedRef = React.useCallback(
			(node: HTMLDivElement | null) => {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
				}
				(drawerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
			},
			[ref, drawerRef]
		);

		React.useEffect(() => {
			if (visible && drawerRef.current) {
				// Mark content as visible for animations
				drawerRef.current.setAttribute("data-vaul-drawer-visible", "true");
			}
		}, [visible, drawerRef]);

		return (
			<DialogPrimitive.Portal>
				<DialogPrimitive.Content
					ref={combinedRef}
					style={getContentStyle(style) as React.CSSProperties}
					data-vaul-drawer=""
					data-vaul-drawer-direction={direction}
					data-vaul-drawer-visible={visible ? "true" : "false"}
					onPointerDown={onPress}
					onPointerUp={onRelease}
					onPointerMove={onDrag}
					onTouchEnd={onRelease}
					onTouchMove={onDrag}
					{...props}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		);
	}
);

DrawerContent.displayName = "DrawerContent";
