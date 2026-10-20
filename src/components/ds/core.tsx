import Link from "next/link";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  disabled,
  href,
  onClick,
  className,
  children,
}: ButtonProps) {
  const classes = cn(
    "avr-btn",
    `avr-btn--${variant}`,
    size === "sm" && "avr-btn--sm",
    fullWidth && "avr-btn--full",
    className,
  );
  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

interface IconButtonProps {
  glyph: ReactNode;
  label: string;
  size?: number;
  variant?: "outline" | "glass";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}

export function IconButton({
  glyph,
  label,
  size = 36,
  variant = "outline",
  disabled,
  onClick,
  className,
  style,
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "avr-iconbtn",
        `avr-iconbtn--${variant}`,
        size > 40 && "avr-iconbtn--lg",
        className,
      )}
      style={{ width: size, height: size, ...style }}
    >
      {glyph}
    </button>
  );
}

interface BadgeProps {
  variant?: "outline" | "subtle" | "accent";
  href?: string;
  children: ReactNode;
}

export function Badge({ variant = "outline", href, children }: BadgeProps) {
  const classes = cn("avr-badge", `avr-badge--${variant}`);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}

export function BadgeGroup({
  items,
  variant = "outline",
}: {
  items: string[];
  variant?: BadgeProps["variant"];
}) {
  return (
    <div className="avr-badge-group">
      {items.map((k) => (
        <Badge key={k} variant={variant}>
          {k}
        </Badge>
      ))}
    </div>
  );
}
