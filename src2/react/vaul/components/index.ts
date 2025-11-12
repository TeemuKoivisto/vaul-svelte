export { DrawerRoot as Root } from "./root";
export { DrawerContent as Content } from "./content";
export { DrawerOverlay as Overlay } from "./overlay";
export { DrawerNestedRoot as NestedRoot } from "./nested-root";
export { DrawerClose as Close } from "./close";
export { DrawerTrigger as Trigger } from "./trigger";

import { DialogPortal, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Portal = DialogPortal;
export const Title = DialogTitle;
export const Description = DialogDescription;

export * from "./types";
