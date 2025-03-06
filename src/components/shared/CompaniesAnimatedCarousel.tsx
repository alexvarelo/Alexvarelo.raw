"use client";

import { motion } from "framer-motion";

const press = [
  "wix",
  "wordpress",
  "notion",
  "trello",
  "figma",
  "dropbox",
  "ghost",
  "medium",
  "googleslides",
  "mailchimp",
  "squarespace",
];

const logos = [...press, ...press];

export function CompaniesAnimatedCarousel() {
  return (
    <section id="press" className="py-14 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 relative">
        <h3 className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
          FEATURED IN
        </h3>

        <div className="relative mt-6 w-full flex items-center">
          <motion.div
            className="flex space-x-6"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {logos.map((logo, idx) => (
              <img
                key={idx}
                src={`./${logo}.svg`}
                className="h-16 w-32 transition-all duration-300 dark:invert dark:brightness-200"
                alt={`logo-${logo}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
