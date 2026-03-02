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
    <div className={cn("flex gap-1", className)}>
      <button
        onClick={onPrevClick}
        className={cn(
          "p-2 rounded-full hover:bg-black/5 transition-all text-gray-800",
          prevDisabled && "opacity-30 cursor-not-allowed"
        )}
        disabled={prevDisabled}
        title="Previous Image"
      >
        <IoChevronBack size={18} />
      </button>
      <button
        onClick={onNextClick}
        className={cn(
          "p-2 rounded-full hover:bg-black/5 transition-all text-gray-800",
          nextDisabled && "opacity-30 cursor-not-allowed"
        )}
        disabled={nextDisabled}
        title="Next Image"
      >
        <IoChevronForward size={18} />
      </button>
    </div>
  );
};