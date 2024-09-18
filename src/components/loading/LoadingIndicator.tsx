import { FunctionComponent } from "react";

interface LoadingIndicatorProps {
    value: number | string | undefined; 
    loadingSize?: "xs" | "sm" | "md" | "lg";
}
 
const LoadingIndicator: FunctionComponent<LoadingIndicatorProps> = ({value, loadingSize}) => {
    if (value){
        return <span>{value}</span>;
    }
    return <span className={`loading loading-dots loading-${loadingSize ?? "sm"}`}></span>
}
 
export default LoadingIndicator;