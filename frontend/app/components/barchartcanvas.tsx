import React from "react";
import BarChart from "./barchart";

interface BarChartProps {
  username: string;
}
const ExamplePage: React.FC<BarChartProps> = ({ username }) => {
  return (
    <div>
      <h1>Disease Frequencies</h1>
      <BarChart username={username} />
    </div>
  );
};

export default ExamplePage;
