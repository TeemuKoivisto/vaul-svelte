import * as React from "react";
import { DialogOverlay } from "@radix-ui/react-dialog";

import { useDrawerContext } from "../ctx";
import { useStore } from "../use-store";

import type { OverlayProps } from "./types";

import "../../drawer.css";

export const DrawerOverlay = React.forwardRef<HTMLDivElement, OverlayProps>(
	({ className, ...props }, ref) => {
		const vaul = useDrawerContext();
		const isOpen = useStore(vaul.states.isOpen);
		const visible = useStore(vaul.states.visible);
		const snapPoints = useStore(vaul.states.snapPoints);
		const shouldFade = useStore(vaul.states.shouldFade);

		const combinedRef = React.useCallback(
			(node: HTMLDivElement | null) => {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
				}
				vaul.refs.overlayRef.set(node ?? undefined);
			},
			[ref, vaul.refs.overlayRef]
		);

		const hasSnapPoints = !!(snapPoints && snapPoints.length > 0);

		return (
			<DialogOverlay
				ref={combinedRef}
				className={className}
				data-vaul-drawer-visible={visible ? "true" : "false"}
				data-vaul-overlay=""
				data-vaul-snap-points={isOpen && hasSnapPoints ? "true" : "false"}
				data-vaul-snap-points-overlay={isOpen && shouldFade ? "true" : "false"}
				onMouseUp={vaul.methods.onRelease}
				{...props}
			/>
		);
	}
);

DrawerOverlay.displayName = "DrawerOverlay";
