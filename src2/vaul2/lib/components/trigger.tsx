import * as React from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useDrawerContext } from "../ctx";

export interface DrawerTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogTrigger> {
	asChild?: boolean;
}

export const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
	({ asChild, children, ...props }, ref) => {
		const vaul = useDrawerContext();

		const combinedRef = React.useCallback(
			(node: HTMLButtonElement | null) => {
				if (typeof ref === "function") {
					ref(node);
				} else if (ref) {
					(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
				}
				vaul.refs.triggerRef.set(node ?? undefined);
			},
			[ref]
		);

		return (
			<DialogTrigger ref={combinedRef} asChild={asChild} {...props}>
				{children}
			</DialogTrigger>
		);
	}
);

DrawerTrigger.displayName = "DrawerTrigger";
