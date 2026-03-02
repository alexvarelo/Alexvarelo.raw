import { FC, FunctionComponent, PropsWithChildren } from "react";

const GradientText: FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="inline-block bg-gradient-to-r from-blue-300 to-blue-950 bg-clip-text text-transparent py-2 px-1">
      {children}
    </span>
  );
};

export default GradientText;
