import React from "react";
import BarChart from "./barchart";

interface BarChartProps {
  username: string;
}

const ExamplePage: React.FC<BarChartProps> = ({ username }) => {
  return (
    <div className="w-3/4 mx-auto">
      
      
      <h1 className="w-full text-5xl text-center mb-4"><b>Disease Frequencies:</b></h1>
      
      <div className="flex justify-center">
        <div className="w-1/2">
          <BarChart username={username} />
        </div>
      </div>
    </div>
  );
};

export default ExamplePage;
