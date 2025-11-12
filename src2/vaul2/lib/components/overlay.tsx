import * as React from "react";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { useDrawerContext } from "../ctx";
import type { OverlayProps } from "./types";
import "../../drawer.css";

export const DrawerOverlay = React.forwardRef<HTMLDivElement, OverlayProps>(
	({ className, ...props }, ref) => {
		const { overlayRef, visible, isOpen, snapPoints, onRelease } = useDrawerContext();

		const combinedRef = React.useCallback(
			(node: HTMLDivElement | null) => {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
				}
				(overlayRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
			},
			[ref, overlayRef]
		);

		const hasSnapPoints = snapPoints && snapPoints.length > 0;

		return (
			<DialogOverlay
				ref={combinedRef}
				className={className}
				data-vaul-drawer-visible={visible ? "true" : "false"}
				data-vaul-overlay=""
				data-vaul-snap-points={isOpen && hasSnapPoints ? "true" : "false"}
				data-vaul-snap-points-overlay={isOpen && visible ? "true" : "false"}
				onMouseUp={onRelease}
				{...props}
			/>
		);
	}
);

DrawerOverlay.displayName = "DrawerOverlay";
