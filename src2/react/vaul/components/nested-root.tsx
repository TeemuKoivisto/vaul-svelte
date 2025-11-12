"use client";

import React from "react";
import { DrawerRoot } from "./root";
import { useDrawerContext } from "../ctx";
import type { Props } from "./types";

export interface DrawerNestedRootProps extends Omit<Props, "nested"> {
	onDrag?: Props["onDrag"];
	onOpenChange?: Props["onOpenChange"];
	open?: Props["open"];
}

export function DrawerNestedRoot({
	onDrag,
	onOpenChange,
	open,
	children,
	...props
}: DrawerNestedRootProps) {
	const { onNestedDrag, onNestedOpenChange, onNestedRelease } = useDrawerContext();

	if (!onNestedDrag || !onNestedOpenChange || !onNestedRelease) {
		throw new Error("NestedRoot must be a child of a Root");
	}

	return (
		<DrawerRoot
			nested={true}
			open={open}
			onClose={() => {
				onNestedOpenChange(false);
			}}
			onDrag={(e, p) => {
				onNestedDrag(e, p);
				onDrag?.(e, p);
			}}
			onOpenChange={(o) => {
				if (o) {
					onNestedOpenChange(o);
				}
				onOpenChange?.(o);
			}}
			onRelease={onNestedRelease}
			{...props}
		>
			{children}
		</DrawerRoot>
	);
}
