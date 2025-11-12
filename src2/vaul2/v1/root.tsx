import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Root: React.FC<React.PropsWithChildren<Dialog.DialogProps>> = (props) => {
	return <Dialog.Root {...props} />;
};
