'use client'
import { useState } from 'react';
import CloseButton from './close_button';
import SubmissionResult from './submission_result';
import title from '../public/newTitle.png'
import ImageList from "./ImageList"
interface DashProps
{
    username: string,
}

function Dash({ username }: DashProps)
{
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [images, setImages] = useState<[string, string][]>([]);
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
              console.log("data: " +data);
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

        let modified: [string, string][] = await Promise.all(
          submissions.map(async ([image_bytes, desc]) => {
            console.log("image_bytes: " + image_bytes)
            const blob = new Blob([image_bytes], { type: 'image/jpeg' });
            const imageURL = URL.createObjectURL(blob);
            console.log("url: "+imageURL)
            console.log('Blob type:', blob.type);

            const img = new Image();
            img.onload = function() {
            console.log('Image loaded successfully');
            // Perform further actions if needed
            };
      img.onerror = function() {
        console.error('Failed to load image');
        // Handle error scenario
      };
      img.src = imageURL;  // Assign the Blob URL to the image src attribute


            return [imageURL, desc];
          })
        );
        //setImages(modified)
       
        console.log("submissions: " + submissions)
        console.log("modified: " + modified)
        return modified
    }

    return (
      <div className="w-full flex items-center justify-center">
        <div className="w-full">
          <button className="border-black bg-emerald-700 border-2 justify-center text-center w-full p-4 z-50 rounded-lg hover:bg-emerald-800 text-4xl text-white"
                    onClick={() => {openModal(); populateList(); console.log("Dashboard clicked");}}>
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
            <div className="flex ">

            <div className="flex-col w-1/2 items-center ">
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