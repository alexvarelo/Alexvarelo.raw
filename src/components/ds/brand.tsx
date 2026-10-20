import { ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

export function Wordmark({
  photosLabel = "PHOTOS",
  className,
}: {
  photosLabel?: string;
  className?: string;
}) {
  return (
    <h1 className={cn("avr-wordmark", className)}>
      <span className="avr-wordmark__grad">ALEXVARELO.RAW</span>
      <span className="avr-wordmark__solid">{photosLabel}</span>
    </h1>
  );
}

export function LogoText() {
  return <span className="avr-logotext">alexvarelo.raw</span>;
}

/** Rotating circular text around a round avatar slot. Size it with CSS on the root. */
export function TextRing({
  text = "ALEXVARELO · RAW · PHOTOS · ALEXVARELO · RAW · ",
  className,
  children,
}: {
  text?: string;
  className?: string;
  children: ReactNode;
}) {
  const id = "avr-ring-" + useId().replace(/:/g, "");
  return (
    <div className={cn("avr-ring", className)}>
      <div className="avr-ring__text">
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          <defs>
            <path
              id={id}
              d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0"
            />
          </defs>
          <text>
            <textPath href={"#" + id}>{text}</textPath>
          </text>
        </svg>
      </div>
      <div className="avr-ring__inner">{children}</div>
    </div>
  );
}
