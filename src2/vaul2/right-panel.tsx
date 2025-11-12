import * as React from "react";

import { Drawer } from "./index";

export function RightPanel() {
	const [expanded, setExpanded] = React.useState(false);

	React.useEffect(() => {
		console.log("mounted");
	}, []);

	return (
		<Drawer.Root
			direction="right"
			open={expanded}
			onOpenChange={setExpanded}
			dismissible={true}
			closeOnOutsideClick={true}
		>
			<Drawer.Trigger asChild>
				<button onClick={() => console.log("clicked")}>OPEN</button>
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 z-30 bg-black/40" />
				<Drawer.Content
					className="fixed bottom-0 right-0 z-30 flex h-full rounded-l-xl"
					aria-describedby={undefined}
				>
					<div>this is right RightPanel</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
