import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Close: React.FC<React.ComponentProps<typeof Dialog.Close>> = (props) => {
	return <Dialog.Close {...props} />;
};
