import { FunctionComponent } from "react";

interface StatsContainerProps {
    title: string;
    stat: number;
    additionalItem: string
}

const StatsContainer: FunctionComponent<StatsContainerProps> = ({title, stat, additionalItem}) => {
  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{stat}</div>
        <div className="stat-desc">{additionalItem}</div>
      </div>
    </div>
  );
};

export default StatsContainer;
