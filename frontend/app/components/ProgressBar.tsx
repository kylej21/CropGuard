import React from "react";
import { usePathname } from "next/navigation";
//@ts-expect-error
const ProgressBar = ({ progressData }) => {
  const colors = [
    "bg-blue-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
  ]; // colors array

  return (
    <div className="justify-center items-center flex-col space-y-4 w-1/2 text-white">
      {/*@ts-expect-error*/}
      {progressData.map((item, index) => (
        <div className="flex-col text-xl" key={index}>
          <div
            className={`w-full items-center justify-center rounded-full bg-gray-200`}
          >
            <div
              className={`${colors[index % colors.length]} text-xs font-medium text-white text-center p-0.5 leading-none rounded-full`}
              style={{ width: `${item.percentage}%` }}
            >
              {item.percentage}%
            </div>
          </div>
          <div className="text-center mt-2 text-white">{item.className}</div>
        </div>
      ))}
    </div>
  );
};
export default ProgressBar;
