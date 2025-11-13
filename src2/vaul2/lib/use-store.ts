import React from "react";
import type { Readable } from "../svelte-store";

export const useStore = <T>(store: Readable<T>) =>
	React.useSyncExternalStore(store.subscribe, store.get, store.get);
