import { cn } from "@/lib/utils";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ImageNavigationButtonsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  className?: string;
}

export const ImageNavigationButtons: React.FC<ImageNavigationButtonsProps> = ({
  onPrevClick,
  onNextClick,
  prevDisabled,
  nextDisabled,
  className
}) => {
  return (
    <div className={cn("flex gap-2", className)}>
      <button
        onClick={onPrevClick}
        className={cn(
          "px-3 py-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all flex items-center gap-2",
          prevDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={prevDisabled}
      >
        <IoChevronBack size={16} />
        <span className="text-sm">Previous</span>
      </button>
      <button
        onClick={onNextClick}
        className={cn(
          "px-3 py-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all flex items-center gap-2",
          nextDisabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={nextDisabled}
      >
        <span className="text-sm">Next</span>
        <IoChevronForward size={16} />
      </button>
    </div>
  );
};