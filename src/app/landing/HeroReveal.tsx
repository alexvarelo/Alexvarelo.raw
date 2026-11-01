"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { APP_CONFIG } from "@/constants/app";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const WORDMARK = "ALEXVARELO.RAW";

/** Home hero: the wordmark rises letter by letter, then "PHOTOS" and the memoji pop in. */
export function HeroReveal() {
  const { t } = useLanguage();
  return (
    <section className="avr-hero avr-section">
      <h1 className="avr-hero__title" aria-label={`${WORDMARK} ${t.photos}`}>
        <a
          href="https://www.instagram.com/alexvarelo.raw"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="avr-hero__line avr-hero__shimmer" aria-hidden="true">
            {WORDMARK.split("").map((ch, i) => (
              <span key={i} className="avr-hero__mask">
                <motion.span
                  style={{ display: "inline-block" }}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: 0.1 + i * 0.04,
                  }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </span>
        </a>
        <span className="avr-hero__line avr-hero__solid" aria-hidden="true">
          <span className="avr-hero__mask">
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            >
              {t.photos}
            </motion.span>
          </span>
          <motion.img
            src={APP_CONFIG.memoji}
            alt=""
            className="avr-hero__memoji"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: [0, 14, -8, 0] }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 300,
                damping: 12,
                delay: 1.1,
              },
              rotate: { duration: 1.2, delay: 1.3 },
            }}
          />
        </span>
      </h1>
      <motion.p
        className="avr-hero__tag"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {t.tag}
      </motion.p>
    </section>
  );
}
