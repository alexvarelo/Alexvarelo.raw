import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";

// Register necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalValue {
  date: string;
  value: number;
}

interface LineChartProps {
  viewsData: HistoricalValue[];
  downloadsData: HistoricalValue[];
}

const LineChart = ({ viewsData, downloadsData }: LineChartProps) => {
  // Prepare the chart data with two datasets for views and downloads
  const chartData = useMemo(() => {
    return {
      labels: viewsData?.map((item) => format(parseISO(item.date), "yyyy-MM")), // Format date to "YYYY-MM"
      datasets: [
        {
          label: "Views",
          data: viewsData.map((item) => item.value),
          borderColor: "#9CA3AF",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          label: "Downloads",
          data: downloadsData.map((item) => item.value),
          borderColor: "#2196F3",
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };
  }, [viewsData, downloadsData]);

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            font: { size: 12 },
            color: "#4B5563", // Tailwind's gray-600
            usePointStyle: true, // Use circular icons
            pointStyle: "circle",

          },
        },
        tooltip: {
          intersect: false,
          //mode: 'index',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          backgroundColor: "rgba(31, 41, 55, 0.9)", // Tailwind's gray-800
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false, // Hide x-axis grid lines
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 6,
            color: "#9CA3AF", // Tailwind's gray-400
          },
        },
        y: {
          display: false,
          grid: {
            display: false, // Hide y-axis grid lines
          },
          ticks: {
            color: "#9CA3AF", // Tailwind's gray-400
          },
        },
      },
    }),
    []
  );

  return (
    <div className="p-4 rounded-lg shadow-sm max-w-lg mx-auto">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
