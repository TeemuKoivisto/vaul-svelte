import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Overlay: React.FC<React.ComponentProps<typeof Dialog.Overlay>> = (props) => {
	return <Dialog.Overlay {...props} />;
};
