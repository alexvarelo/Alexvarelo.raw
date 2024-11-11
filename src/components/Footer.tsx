import { FC, useContext } from "react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-4 text-gray-500">
      <hr className="border-gray-200" />
      <p className="pt-7 pb-4 text-xs">
        © {currentYear} Made by Alexvarelo with love. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
