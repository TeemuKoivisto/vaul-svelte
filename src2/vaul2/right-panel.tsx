import * as React from "react";

import { Drawer } from "./index";

export function RightPanel() {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<Drawer.Root
			direction="right"
			open={expanded}
			onOpenChange={setExpanded}
			dismissible={true}
			closeOnOutsideClick={true}
		>
			<Drawer.Trigger className="cursor-pointer rounded bg-gray-200 px-2 py-1">OPEN</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 z-30 bg-black/40" />
				<Drawer.Content
					className="fixed bottom-0 right-0 z-30 flex h-full w-80 flex-col rounded-l-xl bg-white"
					aria-describedby={undefined}
				>
					<Drawer.Title>Right panel</Drawer.Title>
					<div>content</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
