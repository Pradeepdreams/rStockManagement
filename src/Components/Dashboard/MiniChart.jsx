// components/MiniChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register components
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

const MiniChart = ({
  type = "bar",
  dataPoints = [],
  borderColor = "#3B82F6",
  backgroundColor = "#BFDBFE", // blue-200 default fill
}) => {
  const labels = dataPoints.map((_, i) => i + 1);

  const chartData = {
    labels,
    datasets: [
      {
        data: dataPoints,
        borderColor,
        backgroundColor: type === "doughnut" ? [borderColor] : backgroundColor,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const commonOptions = {
    responsive: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const chartProps = {
    data: chartData,
    options: type === "doughnut" ? { ...commonOptions } : { ...commonOptions, maintainAspectRatio: false },
    width: 60,
    height: 60,
  };

  switch (type) {
    case "bar":
      return <Bar {...chartProps} />;
    case "doughnut":
      return <Doughnut {...chartProps} />;
    default:
      return <Line {...chartProps} />;
  }
};

export default MiniChart;
