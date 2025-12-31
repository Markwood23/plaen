import { Button } from "@/components/ui/button";
import { getButtonIcon } from "@/lib/button-icons";
import type { ReactNode } from "react";
import { useMemo, createElement, isValidElement } from "react";

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
  const text = useMemo(() => {
    const extractText = (node: ReactNode): string => {
      if (node === null || node === undefined || typeof node === "boolean") return "";
      if (typeof node === "string" || typeof node === "number") return String(node);
      if (Array.isArray(node)) return node.map(extractText).join(" ");
      if (isValidElement(node)) {
        const props = node.props as { children?: ReactNode };
        return extractText(props.children);
      }
      return "";
    };

    return extractText(children).replace(/\s+/g, " ").trim();
  }, [children]);
  
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
