"use client";

import { useEffect, useRef, useState } from "react";
import { addEventListener } from "./helpers/index";

export function usePositionFixed({
	isOpen,
	modal,
	nested,
	hasBeenOpened,
}: {
	isOpen: boolean;
	modal: boolean;
	nested: boolean;
	hasBeenOpened: boolean;
}) {
	const previousBodyPositionRef = useRef<Record<string, string> | null>(null);
	const scrollPosRef = useRef(0);
	const [activeUrl, setActiveUrl] = useState(
		typeof window !== "undefined" ? window.location.href : ""
	);

	function setPositionFixed(open: boolean) {
		// If previousBodyPosition is already set, don't set it again.
		if (!(previousBodyPositionRef.current === null && open)) return;

		previousBodyPositionRef.current = {
			position: document.body.style.position,
			top: document.body.style.top,
			left: document.body.style.left,
			height: document.body.style.height,
		};

		// Update the dom inside an animation frame
		const { scrollX, innerHeight } = window;
		const scrollPos = scrollPosRef.current;

		document.body.style.setProperty("position", "fixed", "important");
		document.body.style.top = `${-scrollPos}px`;
		document.body.style.left = `${-scrollX}px`;
		document.body.style.right = "0px";
		document.body.style.height = "auto";

		setTimeout(
			() =>
				requestAnimationFrame(() => {
					// Attempt to check if the bottom bar appeared due to the position change
					const bottomBarHeight = innerHeight - window.innerHeight;
					if (bottomBarHeight && scrollPos >= innerHeight) {
						// Move the content further up so that the bottom bar doesn't hide it
						document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
					}
				}),
			300
		);
	}

	function restorePositionSetting() {
		if (previousBodyPositionRef.current === null) return;
		const currentActiveUrl = activeUrl;
		const previousBodyPosition = previousBodyPositionRef.current;

		// Convert the position from "px" to Int
		const y = -parseInt(document.body.style.top, 10);
		const x = -parseInt(document.body.style.left, 10);

		// Restore styles
		document.body.style.position = previousBodyPosition.position;
		document.body.style.top = previousBodyPosition.top;
		document.body.style.left = previousBodyPosition.left;
		document.body.style.height = previousBodyPosition.height;
		document.body.style.right = "unset";

		requestAnimationFrame(() => {
			if (currentActiveUrl !== window.location.href) {
				setActiveUrl(window.location.href);
				return;
			}

			window.scrollTo(x, y);
		});

		previousBodyPositionRef.current = null;
	}

	// Track scroll position
	useEffect(() => {
		function onScroll() {
			scrollPosRef.current = window.scrollY;
		}

		onScroll();

		const removeListener = addEventListener(window, "scroll", onScroll);

		return () => {
			removeListener();
		};
	}, []);

	// Handle position fixed based on isOpen state
	useEffect(() => {
		if (typeof document === "undefined") return;
		if (nested || !hasBeenOpened) return;

		// This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
		if (isOpen) {
			setPositionFixed(isOpen);

			if (!modal) {
				const timeoutId = setTimeout(() => {
					restorePositionSetting();
				}, 500);
				return () => clearTimeout(timeoutId);
			}
		} else {
			restorePositionSetting();
		}
	}, [isOpen, modal, nested, hasBeenOpened, activeUrl]);

	// Update activeUrl when location changes
	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleLocationChange = () => {
			setActiveUrl(window.location.href);
		};

		// Listen for popstate events (back/forward navigation)
		const removeListener = addEventListener(window, "popstate", handleLocationChange);

		return () => {
			removeListener();
		};
	}, []);

	return { restorePositionSetting };
}
