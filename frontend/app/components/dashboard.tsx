'use client'
import { useState } from 'react';
import CloseButton from './close_button';
import SubmissionResult from './submission_result';
import title from '../public/newTitle.png'

interface DashProps
{
    username: string,
}

function Dash({ username }: DashProps) {
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const openModal = () => {
        setIsCanvasOpen(true);
    };
    
    const closeModal = () => {
        setIsCanvasOpen(false);
    };

    const populateSubmissions = () => {
      const formData = new FormData();
      formData.append("username", username);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      fetch("http://127.0.0.1:5000/login/", requestOptions)
            .then((res) => res.json())
            .then((data) => { console.log(data); })
    }

    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full">
          <button className="border-black bg-emerald-700 border-2 justify-center text-center w-full p-4 z-50 rounded-lg hover:bg-emerald-800 text-4xl text-white"
                    onClick={() => {openModal(); console.log("Dashboard clicked");}}>
            <b>Dashboard</b>
          </button>
        </div>
    
        {/* Overlay with pointer events none */}
        {isCanvasOpen && (
          <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
          {/* Popup Window */}
          <div className="w-2/3 h-3/4 bg-white p-4 rounded-lg shadow-lg text-black overflow-y-scroll">
            
            {/* TODO: populate results components */}
            {username}

          
          </div>
          <CloseButton onClick={closeModal}/>
      </div>
        )}
      </div>
    );
}

export default Dash;