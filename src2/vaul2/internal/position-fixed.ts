import { addEventListener, effect, noop } from "./helpers/index";
import { writable, type Writable } from "../svelte-store";

export function handlePositionFixed({
	isOpen,
	modal,
	nested,
	hasBeenOpened,
	activeListeners,
}: {
	isOpen: Writable<boolean>;
	modal: Writable<boolean>;
	nested: Writable<boolean>;
	hasBeenOpened: Writable<boolean>;
	activeListeners: Writable<Set<() => void>>;
}) {
	let previousBodyPositionRef: Record<string, string> | null = null;
	let scrollPosRef = 0;
	const activeUrl = writable(typeof window !== "undefined" ? window.location.href : "");

	function setPositionFixed(open: boolean) {
		// If previousBodyPosition is already set, don't set it again.
		if (!(previousBodyPositionRef === null && open)) return;

		previousBodyPositionRef = {
			position: document.body.style.position,
			top: document.body.style.top,
			left: document.body.style.left,
			height: document.body.style.height,
		};

		// Update the dom inside an animation frame
		const { scrollX, innerHeight } = window;
		const scrollPos = scrollPosRef;

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
		if (previousBodyPositionRef === null) return;
		const currentActiveUrl = activeUrl.get();
		const previousBodyPosition = previousBodyPositionRef;

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
				activeUrl.set(window.location.href);
				return;
			}

			window.scrollTo(x, y);
		});

		previousBodyPositionRef = null;
	}

	activeListeners.update((listeners) => {
		listeners.add(() => {
			// Track scroll position

			function onScroll() {
				scrollPosRef = window.scrollY;
			}

			onScroll();

			return addEventListener(window, "scroll", onScroll);
		});

		listeners.add(() => {
			// Update activeUrl when location changes

			if (typeof window === "undefined") return;

			const handleLocationChange = () => {
				activeUrl.set(window.location.href);
			};

			// Listen for popstate events (back/forward navigation)
			return addEventListener(window, "popstate", handleLocationChange);
		});

		listeners.add(
			// Handle position fixed based on isOpen state
			effect(
				// @TODO is activeUrl needed? not read here
				[isOpen, modal, nested, hasBeenOpened, activeUrl],
				([$isOpen, $modal, $nested, $hasBeenOpened]) => {
					if (typeof document === "undefined") return noop;
					if ($nested || !$hasBeenOpened) return noop;

					// This is needed to force Safari toolbar to show **before** the drawer starts animating to prevent a gnarly shift from happening
					// Force Safari toolbar to show before animating to prevent layout shift
					if ($isOpen) {
						setPositionFixed($isOpen);

						if (!$modal) {
							const timeoutId = setTimeout(() => {
								restorePositionSetting();
							}, 500);
							return () => clearTimeout(timeoutId);
						}
					} else {
						restorePositionSetting();
					}
					return noop;
				}
			)
		);

		return listeners;
	});

	return { restorePositionSetting };
}
