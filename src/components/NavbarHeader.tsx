"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeIndicator from "./ThemeIndicator";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const NavbarHeader = () => {
  const [showAvatar, setShowAvatar] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowAvatar(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="navbar bg-base-100 pr-10 pl-10 mt-5 sticky top-0 z-50">
      <div className="navbar-start flex items-center">
        {showAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="avatar"
          >
            <div className="ring-primary ring-offset-base-100 w-12 rounded-full">
              <img src={"/ProfileAvatar.png"} />
            </div>
          </motion.div>
        )}
      </div>
      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/"}>Homepage</Link>
          </li>
          <li>
            <Link href={"/collections"}>Collections</Link>
          </li>
          <li>
            <Link href={"/profile"}>Statistics</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeIndicator />
      </div>
    </div>
  );
};

export default NavbarHeader;
