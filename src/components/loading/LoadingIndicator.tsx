import { Children, FunctionComponent, PropsWithChildren } from "react";

interface LoadingIndicatorProps {
    isLoading: boolean;
    loadingSize?: "xs" | "sm" | "md" | "lg";
}
 
const LoadingIndicator: React.FC<PropsWithChildren<LoadingIndicatorProps>> = ({isLoading, loadingSize, children}) => {
    if (!isLoading){
        return <span>{children}</span>;
    }
    return <span className={`loading loading-dots loading-${loadingSize ?? "sm"}`}></span>
}
 
export default LoadingIndicator;