// components/ImageList.tsx
import { useState, useEffect } from "react";
import React from "react";
import { TbBinaryTree } from "react-icons/tb";
import MarkdownRenderer from "./MarkdownRenderer";
interface BarChartProps {
  username: string;
}

const ActionableInsights: React.FC<BarChartProps> = ({ username }) => {
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let insight = await fetch("http://127.0.0.1:5000/insight/" + username)
        .then((res) => res.json())
        .then((res) => res["action"]);
      setAction(insight);
      setLoading(false);
    };
    fetchData();
  }, [username]);
  return (
    <div>
      {loading && (
        <div className="flex items-start justify-start">
          <div className="flex-col gap-4 w-full flex items-center justify-start">
            {/* tuff binary tree */}
            <div className="w-80 h-80 border-8 text-green-400 text-4xl animate-spin border-gray-300 flex items-start justify-center border-t-green-400 rounded-full">
              <TbBinaryTree className="w-40 h-40" />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col p-4 h-full space-y-4">
        <div className="mb-4 overflow-y-auto">
          <div className="justify-start text-center">
            <div className="pb-4 text-3xl">Insights:</div>
          </div>
          <div className="text-base w-full border-2 p-2 border-emerald-200 bg-emerald-100 rounded-lg">
            <MarkdownRenderer markdownText={action} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionableInsights;
