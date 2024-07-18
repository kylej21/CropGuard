"use client";
import { useState, useEffect } from "react";
import CloseButton from "./close_button";
import SubmissionResult from "./submission_result";
import title from "../public/newTitle.png";
import ImageList from "./ImageList";
import IndexPage from "./barchartcanvas";
import ActionableInsights from "./ActionableInsights";
import { enqueueSnackbar } from "notistack";
interface DashProps {
  username: string;
}

function Dash({ username }: DashProps) {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [images, setImages] = useState<[string, string][]>([]);
  const [chartData, setChartData] = useState<any>(null); // Adjust type as per your data structure
  const [numSubmissions, setNumSubmissions] = useState<number>(0);
  const openModal = () => {
    setIsCanvasOpen(true);
  };

  const closeModal = () => {
    setIsCanvasOpen(false);
  };

  // Gets submissions JSON information of user's data
  const getData = ()=> {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username: username}),
    };

    let data = fetch(
      "/api/submissions",
      requestOptions,
    )
      .then((data) => {
        const body = data.json().then((body)=>{
          if(data.status==200){
            console.log(body.data)
            enqueueSnackbar('Data Loaded!', { variant: 'success', autoHideDuration: 2000 });
            setImages(body.data);
            setNumSubmissions(body.data.length)
            return data;
          }
          else{
            enqueueSnackbar('Error Loading Data!', { variant: 'error', autoHideDuration: 2000 });

          }
        })
        
      });
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full">
        <button
          className="border-black bg-emerald-700 border-2 justify-center text-center w-full p-4 z-50 rounded-lg hover:bg-emerald-800 text-4xl text-white"
          onClick={() => {
            openModal();
            getData();
            console.log("Dashboard clicked");
          }}
        >
          <b>Dashboard</b>
        </button>
      </div>

      {/* Overlay with pointer events none */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
          {/* Popup Window */}
          <div className="flex-col w-4/5 h-5/6 p-4 rounded-lg shadow-lg text-black overflow-y-scroll space-y-4 bg-green-500">
            <div className="flex text-start w-full items-center justify-start text-black font-semibold text-4xl pl-4">
              <div className="h-full w-5/12 p-2 rounded-xl bg-white border-black border-2 text-center">
              {username}
              </div>
              <div className="w-full text-center text-6xl">
                  Dashboard
              </div>
              <div className="w-5/12 p-2 rounded-xl bg-white border-black border-2 text-center h-full">
                Uploads: {numSubmissions} 
              </div>
            </div>
            {/* TODO: populate results components */}
            <div className="flex h-5/6 border-2 border-black rounded-xl p-4 bg-white">
              <div className="flex-col w-1/2 items-center h-full">
                <ImageList images={images} />
              </div>
              <div className="w-1/2 text-center text-5xl h-full overflow-auto">
                <IndexPage username={username} />
                <div className="pt-4">
                  <ActionableInsights username={username} />
                </div>
              </div>
            </div>
          </div>
          <CloseButton onClick={closeModal} />
        </div>
      )}
    </div>
  );
}

export default Dash;
