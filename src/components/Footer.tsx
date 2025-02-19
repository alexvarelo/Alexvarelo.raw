import { FC, useContext } from "react";
import { FaInstagram } from "react-icons/fa";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-4 text-gray-500">
      <hr className="border-gray-200" />
      <p className="pt-7 text-xs sm:text-2xs">
        © {currentYear} Made by <span className="font-bold">Alexvarelo </span>
        with love. All rights reserved. <br />
        All photos are my own, provided by{" "}
        <a
          href="https://unsplash.com/es/@alexvarelo"
          target="_blank"
          className="font-bold"
        >
          Unsplash
        </a>
        .
      </p>
      <div className="flex justify-center mt-2 pb-2">
        <a
          href="https://www.instagram.com/alexvarelo.raw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 transition duration-300"
        >
          <FaInstagram size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
