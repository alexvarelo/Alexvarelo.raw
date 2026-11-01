/**
 * Re-mounts on every navigation (unlike layout.tsx), so each page plays the
 * `.avr-enter` entrance: its top-level sections rise in one after another.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="avr-enter">{children}</div>;
}
