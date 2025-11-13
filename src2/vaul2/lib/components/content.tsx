import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { useDrawerContext } from "../ctx";
import { useStore } from "../use-store";

import type { ContentProps } from "./types";

import "../../drawer.css";

export const DrawerContent = React.forwardRef<HTMLDivElement, ContentProps>(
	({ style, children, ...props }, ref) => {
		const vaul = useDrawerContext();

		// Subscribe to store-like values from vaul

		const visible = useStore(vaul.states.visible);
		const isOpen = useStore(vaul.states.isOpen);
		const direction = useStore(vaul.options.direction);
		const getContentStyle = useStore(vaul.helpers.getContentStyle);

		const combinedRef = React.useCallback(
			(node: HTMLDivElement | null) => {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
				}
				vaul.refs.drawerRef.set(node ?? undefined);
			},
			[ref, vaul.refs.drawerRef]
		);

		/**
		 * Is this supposed to do this???
<script lang="ts">
	// 	Internal only component used to detect when the content
	// is actually mounted (via a conditional {#if ...}) and sets the visible
	// state, which triggers the open animation
	import { onMount } from "svelte";
	import { getCtx } from "../ctx.js";

	const {
		states: { visible },
		methods: { scaleBackground, restorePositionSetting },
	} = getCtx();

	onMount(() => {
		visible.set(true);

		return () => {
			scaleBackground(false);
			restorePositionSetting();
		};
	});
</script>
		 */
		React.useEffect(() => {
			// When content mounts and dialog is open, mark visible in vaul state
			if (isOpen) {
				vaul.states.visible.set(true);
			}
		}, [isOpen, vaul.states.visible]);

		React.useEffect(() => {
			const node = vaul.refs.drawerRef.get();
			if (visible && node) {
				node.setAttribute("data-vaul-drawer-visible", "true");
			}
		}, [visible, vaul.refs.drawerRef]);

		return (
			<DialogPrimitive.Portal>
				<DialogPrimitive.Content
					ref={combinedRef}
					style={getContentStyle((style as unknown as string) ?? "") as React.CSSProperties}
					data-vaul-drawer=""
					data-vaul-drawer-direction={direction}
					data-vaul-drawer-visible={visible ? "true" : "false"}
					onPointerDown={vaul.methods.onPress}
					onPointerUp={vaul.methods.onRelease}
					onPointerMove={vaul.methods.onDrag}
					onTouchEnd={vaul.methods.onRelease}
					onTouchMove={vaul.methods.onDrag}
					{...props}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		);
	}
);

DrawerContent.displayName = "DrawerContent";
