import { FunctionComponent } from "react";
import LoadingIndicator from "./loading/LoadingIndicator";
import { Checks } from "@/app/utils/checks";

interface StatsContainerProps {
  title: string;
  stat: number;
  additionalItem: string;
}

const StatsContainer: FunctionComponent<StatsContainerProps> = ({
  title,
  stat,
  additionalItem,
}) => {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <LoadingIndicator isLoading={Checks.isNil(stat)}>
          <div className="stat-value">{stat}</div>
        </LoadingIndicator>
        <div className="stat-desc">{additionalItem}</div>
      </div>
    </div>
  );
};

export default StatsContainer;
