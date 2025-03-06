import { FC, FunctionComponent, PropsWithChildren } from "react";

const GradientText: FC<PropsWithChildren> = ({children}) => {
  return (
    <span className="bg-gradient-to-r from-blue-300 to-blue-950 bg-clip-text text-transparent">
      {children}
    </span>
  );
};

export default GradientText;
