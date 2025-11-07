import { Button } from "@/components/ui/button";
import { getButtonIcon } from "@/lib/button-icons";
import type { ReactNode } from "react";
import { useMemo, createElement } from "react";

interface SmartButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: ReactNode;
  iconPosition?: "left" | "right";
  forceIcon?: React.ComponentType<{ className?: string }>;
}

export function SmartButton({
  children,
  iconPosition = "right",
  forceIcon,
  className,
  ...props
}: SmartButtonProps) {
  const text = typeof children === "string" ? children : "";
  
  const leftIcon = useMemo(() => {
    if (iconPosition !== "left") return null;
    const Icon = forceIcon || getButtonIcon(text);
    return Icon ? createElement(Icon, { className: "mr-2 h-4 w-4" }) : null;
  }, [forceIcon, text, iconPosition]);

  const rightIcon = useMemo(() => {
    if (iconPosition !== "right") return null;
    const Icon = forceIcon || getButtonIcon(text);
    return Icon ? createElement(Icon, { className: "ml-2 h-4 w-4" }) : null;
  }, [forceIcon, text, iconPosition]);

  return (
    <Button className={className} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Button>
  );
}
