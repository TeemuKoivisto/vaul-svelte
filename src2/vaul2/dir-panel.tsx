import * as React from "react";
import { clsx } from "clsx";

import { Drawer, type DrawerDirection } from "./index";

interface Props {
	direction: DrawerDirection;
}

export function DirPanel({ direction }: Props) {
	return (
		<Drawer.Root direction={direction}>
			<Drawer.Trigger className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
				Open {direction} drawer
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 bg-black/40" />
				<Drawer.Content
					data-testid="content"
					aria-describedby={undefined}
					className={clsx({
						"fixed flex bg-zinc-100 p-6": true,
						"bottom-0 left-0 right-0 h-[50%] flex-col rounded-t-[10px]": direction === "bottom",
						"left-0 right-0 top-0 h-[50%] flex-col rounded-b-[10px]": direction === "top",
						"bottom-0 left-0 top-0 w-[50%] flex-row rounded-r-[10px]": direction === "left",
						"bottom-0 right-0 top-0 w-[50%] flex-row rounded-l-[10px]": direction === "right",
					})}
				>
					<div
						className={clsx({
							"flex h-full w-full gap-8 rounded-full": true,
							"flex-col": direction === "bottom",
							"flex-col-reverse": direction === "top",
							"flex-row-reverse": direction === "left",
							"flex-row ": direction === "right",
						})}
					>
						<div
							className={clsx({
								"rounded-full bg-zinc-300": true,
								"mx-auto h-1.5 w-12": direction === "top" || direction === "bottom",
								"my-auto h-12 w-1.5": direction === "left" || direction === "right",
							})}
						/>
						<div className="grid h-full w-full place-content-center">
							<div className="mx-auto max-w-md">
								<Drawer.Title className="mb-4 font-medium">Drawer for Svelte.</Drawer.Title>
								<p className="mb-2 text-gray-600">
									This component can be used as a Dialog replacement on mobile and tablet devices.
								</p>
								<p className="mb-2 text-gray-600">
									It comes unstyled, has gesture-driven animations, and was originally made by
									<a href="https://emilkowal.ski/" className="underline" target="_blank">
										{" "}
										Emil Kowalski{" "}
									</a>
									and ported to Svelte by
									<a href="https://x.com/huntabyte" className="underline" target="_blank">
										Huntabyte
									</a>
									.
								</p>
								<p className="mb-8 text-gray-600">
									It uses
									<a
										href="https://www.bits-ui.com/docs/components/dialog"
										className="underline"
										target="_blank"
									>
										Bits' Dialog primitive
									</a>
									under the hood and is inspired by
									<a
										href="https://twitter.com/devongovett/status/1674470185783402496"
										className="underline"
										target="_blank"
									>
										this tweet.
									</a>
								</p>
							</div>
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
