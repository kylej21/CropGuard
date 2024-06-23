'use client'
import { useState } from 'react';
import CloseButton from './close_button';
import SubmissionResult from './submission_result';
import title from '../public/newTitle.png'
import ImageList from "./ImageList"
import Image from "react"
interface DashProps
{
    username: string,
}

function Dash({ username }: DashProps)
{
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    //const [images, setImages] = useState<Array<Pair<typeof Image,String>>>([]);
    const images = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg',
    ];
    const openModal = () => {
        setIsCanvasOpen(true);
    };
    
    const closeModal = () => {
        setIsCanvasOpen(false);
    };

    // Gets submissions JSON information of user's data
    async function getData() {
      const formData = new FormData();
      formData.append("username", username);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      let data = fetch("http://127.0.0.1:5000/submissions/", requestOptions)
            .then((res) => res.json())
            .then((data) => { 
              console.log(data);
              return data;
            }).then((data)=>{
              return data["submissions"]!;
            });
      return data;
    }

    async function populateList()
    {
        // [bytes, description]
        let submissions: [Uint8Array, string][] = await getData();

        submissions.map(([image_bytes, desc]) => {
          const blob = new Blob([image_bytes], { type: 'image/png' });
          const imageURL = URL.createObjectURL(blob);
          return [imageURL, desc] as [string, string];
      });
    }

    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full">
          <button className="border-black bg-emerald-700 border-2 justify-center text-center w-full p-4 z-50 rounded-lg hover:bg-emerald-800 text-4xl text-white"
                    onClick={() => {openModal(); getData(); console.log("Dashboard clicked");}}>
            <b>Dashboard</b>
          </button>
        </div>
    
        {/* Overlay with pointer events none */}
        {isCanvasOpen && (
          <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
          {/* Popup Window */}
          <div className="flex-col w-2/3 h-3/4 bg-white p-4 rounded-lg shadow-lg text-black overflow-y-scroll space-y-4">
            <div className="flex text-center w-full items-center justify-center">
            {username}
            </div>
            {/* TODO: populate results components */}
            <div className="flex">

            <div className="flex-col w-1/2 items-center">
              <ImageList images={images} />

            </div>
            <div>
              statistics
            </div>
            </div>
          </div>
          <CloseButton onClick={closeModal}/>
      </div>
        )}
      </div>
    );
}

export default Dash;