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
  onOpenModal: () => void;

}

function NewDash({ username ,onOpenModal}: DashProps) {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [images, setImages] = useState<[string, string][]>([]);
  const [chartData, setChartData] = useState<any>(null); // Adjust type as per your data structure
  const [numSubmissions, setNumSubmissions] = useState<number>(0);
  const [dashSelected, setDashSelected] = useState("Insights");

  const buttons = [
    { name: 'Insights', id: 'insights' },
    { name: 'Graphs', id: 'graphs' },
    { name: 'Submissions', id: 'submissions' },

  ];

  const openModal = () => {
    setIsCanvasOpen(true);
    onOpenModal();
  };

  const closeModal = () => {
    setIsCanvasOpen(false);
    onOpenModal();
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
            setImages(body.data);
            setNumSubmissions(body.data.length)
            return data;
          }
          else{
            enqueueSnackbar('Error Loading Submissions!', { variant: 'error', autoHideDuration: 2000 });

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
              <div className = "w-1/4 flex-col h-full rounded-lg border-2 border-black bg-green-100">
                {buttons.map((button) => (
                <button
                key={button.id}
                className={`w-full h-1/3 text-3xl ${dashSelected === button.name ? 'bg-green-300' : ''} hover:bg-green-300 ${button.id === 'insights' ? 'rounded-t-lg' : button.id === 'button4' ? 'rounded-b-lg' : ''}`}
                onClick={() => setDashSelected(button.name)}
                >
                    {button.name}
                </button>
                ))}
              </div>
              {dashSelected === 'Insights' && <ActionableInsights username={username} />}
              {dashSelected === 'Graphs' && <IndexPage username={username} />}
              {dashSelected === 'Submissions' && <ImageList images={images} />}

              







              {/*<div className="flex-col w-1/2 items-center h-full">
                <ImageList images={images} />
              </div>
              <div className="w-1/2 text-center text-5xl h-full overflow-auto">
                <IndexPage username={username} />
                <div className="pt-4">
                  <ActionableInsights username={username} />
                </div>
              </div>
              */}
            </div>
            
          </div>
          <CloseButton onClick={closeModal} />
        </div>
      )}
    </div>
  );
}

export default NewDash;
