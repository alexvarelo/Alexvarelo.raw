"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeIndicator from "./ThemeIndicator";

const NavbarHeader = () => {
  return (
    <div className="navbar bg-base-100 py-4 pr-7 relative">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href={"/"}>Homepage</Link>
            </li>
            <li>
              <Link href={"/collections"}>Collections</Link>
            </li>
            <li>
              <Link href={"/profile"}>Statistics</Link>
            </li>
            {/* <li>
              <Link href={"/atomic"}>Atomic</Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 lg:navbar-center">
        <Link className="btn btn-ghost text-xl flex items-center justify-center p-0" href="/">
          <div className="ring-primary w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img src={"/ProfileAvatar.png"} alt="Profile" className="rounded-full w-full h-full object-cover" />
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
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
          {/* <li>
            <Link href={"/atomic"}>Atomic</Link>
          </li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <ThemeIndicator />
      </div>
    </div>
  );
};

export default NavbarHeader;
