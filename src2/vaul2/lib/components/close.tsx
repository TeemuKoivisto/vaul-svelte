import * as React from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useDrawerContext } from "../ctx";
import type { CloseProps } from "./types";

export const DrawerClose = React.forwardRef<HTMLButtonElement, CloseProps>(
	({ asChild, children, ...props }, ref) => {
		const { methods } = useDrawerContext();

		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLButtonElement>) => {
				e.preventDefault();
				methods.closeDrawer();
			},
			[methods.closeDrawer]
		);

		const handleKeyDown = React.useCallback(
			(e: React.KeyboardEvent<HTMLButtonElement>) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					methods.closeDrawer(true);
				}
			},
			[methods.closeDrawer]
		);

		return (
			<DialogClose
				ref={ref}
				asChild={asChild}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				{...props}
			>
				{children}
			</DialogClose>
		);
	}
);

DrawerClose.displayName = "DrawerClose";
