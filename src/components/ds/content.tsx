import Link from "next/link";
import { CSSProperties, Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tint = "street" | "video" | "edit" | "travel" | "sea" | "neutral";

interface PhotoFrameProps {
  src?: string;
  alt?: string;
  tint?: Tint;
  /** Real photo colour (Unsplash `color`), shown while the image loads. Overrides the striped tint. */
  color?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Rounded photo container. Without `src` it renders the striped tinted placeholder. */
export function PhotoFrame({
  src,
  alt = "",
  tint = "sea",
  color,
  label,
  className,
  style,
  children,
}: PhotoFrameProps) {
  const tintVars = {
    "--tint-a": `var(--tint-${tint}-a)`,
    "--tint-b": `var(--tint-${tint}-b)`,
  } as CSSProperties;
  return (
    <div
      className={cn("avr-photo", className)}
      style={{
        ...tintVars,
        ...(color ? { background: color } : null),
        ...style,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        label && <span className="avr-photo__label">{label}</span>
      )}
      {children}
    </div>
  );
}

export function StatBlock({
  value,
  label,
  tone = "light",
}: {
  value: string;
  label: string;
  tone?: "light" | "brand";
}) {
  return (
    <div className={cn("avr-stat", tone === "brand" && "avr-stat--brand")}>
      <div className="avr-stat__value">{value}</div>
      <div className="avr-stat__label">{label}</div>
    </div>
  );
}

export function StatLine({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <p className="avr-statline">
      {items.map((s, i) => (
        <Fragment key={s.label}>
          {i > 0 && " · "}
          <b>{s.value}</b> {s.label}
        </Fragment>
      ))}
    </p>
  );
}

export function AboutCard({
  title,
  stats = [],
  className,
  children,
}: {
  title: string;
  stats?: { value: string; label: string }[];
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("avr-about", className)}>
      <div>
        <h2 className="avr-about__title">{title}</h2>
        <p className="avr-about__bio">{children}</p>
      </div>
      {stats.length > 0 && (
        <div className="avr-about__stats">
          {stats.map((s) => (
            <StatBlock
              key={s.label}
              value={s.value}
              label={s.label}
              tone="brand"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return <span className="avr-highlight">{children}</span>;
}

export function DisciplineTile({
  index,
  title,
  tint = "street",
  src,
  meta,
  href = "#",
}: {
  index: string;
  title: string;
  tint?: Tint;
  src?: string;
  meta?: string;
  href?: string;
}) {
  return (
    <Link href={href} className="avr-tile">
      <PhotoFrame src={src} alt={title} tint={tint} style={{ height: "100%" }}>
        <div
          className={cn("avr-tile__overlay", src && "avr-tile__overlay--scrim")}
        >
          <div className="avr-tile__meta">
            <span>{index}</span>
            <span>{meta}</span>
          </div>
          <div className="avr-tile__foot">
            <span className="avr-tile__title">{title}</span>
          </div>
        </div>
      </PhotoFrame>
    </Link>
  );
}

export function SpecList({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="avr-spec">
      {rows.map((r) => (
        <div key={r.k} className="avr-spec__row">
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
