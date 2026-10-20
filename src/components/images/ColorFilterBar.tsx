import React, { FC } from "react";
import { ColorCategory } from "@/app/utils/colorUtils";
import { motion } from "framer-motion";

interface ColorFilterBarProps {
  selectedColor: ColorCategory;
  onSelectColor: (color: ColorCategory) => void;
}

const COLORS: ColorCategory[] = [
  "All",
  "Black",
  "White",
  "Grey",
  "Red",
  "Orange",
  "Yellow",
  "Green",
  "Blue",
  "Purple",
];

export const ColorFilterBar: FC<ColorFilterBarProps> = ({
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10 overflow-x-auto py-2 no-scrollbar">
      {COLORS.map((color) => {
        const isActive = selectedColor === color;
        return (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className="group relative px-4 py-1.5 transition-all duration-300"
          >
            <span
              className={`relative z-10 text-sm font-semibold uppercase tracking-wider ${
                isActive ? "text-white" : "text-gray-500 group-hover:text-black"
              }`}
            >
              {color}
            </span>
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-black rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {!isActive && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            )}
          </button>
        );
      })}
    </div>
  );
};
