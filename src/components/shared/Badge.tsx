import { cn } from "@/lib/utils";

interface BadgeProps {
  text: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, className }) => {
  const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1);
  return (
    <span
      className={cn(
        "inline-block bg-base-300 text-base-content md:text-sm text-xs font-semibold mr-2 px-3 py-1 rounded-full",
        className
      )}
    >
      {capitalizedText}
    </span>
  );
};
