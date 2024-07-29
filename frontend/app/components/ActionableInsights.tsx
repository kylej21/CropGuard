// components/ImageList.tsx
import { useState, useEffect } from "react";
import React from "react";
import { TbBinaryTree } from "react-icons/tb";
import MarkdownRenderer from "./MarkdownRenderer";
import { useSnackbar } from 'notistack';

interface BarChartProps {
  username: string;
}

const ActionableInsights: React.FC<BarChartProps> = ({ username }) => {
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);
  const snackbar = useSnackbar();

  // use effect mounts on load, that way the component only renders once
  useEffect(() => {
    const fetchData = async () => {
      let insight = await fetch("/api/insight/", {
        method: "POST",
        body: JSON.stringify({ username: username }),
      }).then((data)=> {
        const body = data.json().then((body)=>{
          if(data.status==200){
            setAction(body.action);
            //return body.action
          }
          else{
            snackbar.enqueueSnackbar('Error Loading Insights!', { variant: 'error', autoHideDuration: 2000 });
          }
        })
      })
     setLoading(false);
    };
    fetchData();
  }, [username]);
  return (
    <div className="w-3/4 p-4 flex flex-col">
    {loading && (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          
          {/* tuff binary tree */}
          <div className="w-80 h-80 border-8 text-green-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-green-400 rounded-full">
            <TbBinaryTree className="w-40 h-40" />
          </div>
        </div>
      </div>
    )}
    {!loading && (
    <div className="flex flex-col p-4 h-full space-y-4 justify-start w-full">
      <div className="mb-4 w-full h-full">
        <div className="justify-center text-center w-full h-1/6">
          <div className="pb-4 text-5xl w-full"><b>Insights:</b></div>
        </div>
        <div className="text-base w-full border-2 p-2 border-emerald-200 bg-emerald-100 rounded-lg h-5/6 overflow-y-auto">
          <MarkdownRenderer markdownText={action} />
        </div>
      </div>
    </div>
    )}
  </div>
  );
};

export default ActionableInsights;
