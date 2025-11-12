import * as React from "react";

import { Drawer } from "../vaul";

export function LeftPanel() {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<Drawer.Root direction="left" open={expanded} onOpenChange={setExpanded}>
			<Drawer.Trigger className="cursor-pointer rounded bg-gray-200 px-2 py-1">
				LEFT PANEL
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Title>Left panel</Drawer.Title>
				<Drawer.Overlay className="fixed inset-0 z-10 bg-black/40" />
				<Drawer.Content
					className="fixed bottom-0 left-0 z-10 h-full rounded-r-xl"
					aria-describedby={undefined}
				>
					<Drawer.Title>Left panel</Drawer.Title>
					<div>content</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
