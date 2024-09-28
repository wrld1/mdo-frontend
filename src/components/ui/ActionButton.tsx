"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "./button";

const ActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    return <Button {...props}>{children}</Button>;
  }
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
