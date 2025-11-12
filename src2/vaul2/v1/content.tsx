import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Content: React.FC<React.ComponentProps<typeof Dialog.Content>> = (props) => {
	return <Dialog.Content {...props} />;
};
