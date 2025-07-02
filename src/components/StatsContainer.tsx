import { FunctionComponent } from "react";
import LoadingIndicator from "./loading/LoadingIndicator";
import { Checks } from "@/app/utils/checks";
import { NumberTicker } from "./shared/NumberTicker";

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
  console.log("stat", stat);
  return (
    <div className="stats shadow" style={{ overflow: "hidden" }}>
      <div className="stat">
        <div className="stat-title">{title}</div>
        <LoadingIndicator isLoading={Checks.isNil(stat)}>
          <div className="stat-value">
            <NumberTicker value={stat} direction="up" />
          </div>
        </LoadingIndicator>
        <div className="stat-desc">{additionalItem}</div>
      </div>
    </div>
  );
};

export default StatsContainer;
