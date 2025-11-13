import { createContext, useContext } from "react";
import { createVaul } from "../internal/vaul";

export type DrawerContextValue = ReturnType<typeof createVaul>;
export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
	const context = useContext(DrawerContext);
	if (!context) {
		throw new Error("Drawer components must be used within a Drawer.Root");
	}
	return context;
}
