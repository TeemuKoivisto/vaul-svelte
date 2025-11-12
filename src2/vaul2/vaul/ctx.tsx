import { createContext, useContext } from "react";
import type { DrawerContextValue } from "./types";

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
	const context = useContext(DrawerContext);
	if (!context) {
		throw new Error("Drawer components must be used within a Drawer.Root");
	}
	return context;
}

export function DrawerProvider({ children, value }: { children: any; value: DrawerContextValue }) {
	return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}
