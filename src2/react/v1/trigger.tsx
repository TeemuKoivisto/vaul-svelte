import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Trigger: React.FC<React.ComponentProps<typeof Dialog.Trigger>> = (props) => {
	return <Dialog.Trigger {...props} />;
};
