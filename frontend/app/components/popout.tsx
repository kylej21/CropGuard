'use client'
import { useState } from 'react';
import Image from 'react';
import CloseButton from './close_button'

function Popout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [image, changeImage] = useState<File | null>(null);
  let [response, changeResponse] = useState("Threat to plant is: ");
  let [loading, changeLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      changeImage(event.target.files[0]);
    }
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  async function handleSubmission()
  {
    if (loading || !image) return;

    changeLoading(true);
    console.log("Submitting: " + image);

    // body of POST request to send image
    const formData = new FormData();
    formData.append("file", image, image.name);
    formData.append("extension", image.name.split(".").pop() || "");
    console.log(image.name);

    // make post request, and display prompt result
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    await fetch("http://127.0.0.1:5000/upload/", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if(data["status"]=="healthy"){
          changeResponse("No threat! Plant is Healthy!")
        }
        else{
          changeResponse("Threat to plant is: " + data["status"])
        }
        //setResponse(data["generated"]);
      });
    changeLoading(false);
  }

  return (
    <div className="w-screen flex justify-center items-center h-screen">
      <button
        className="w-2/5 relative border hover:border-green-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-20 rounded-lg bg-green-800 p-2 flex justify-center items-center font-extrabold"
        onClick={openModal}
      >
        <div className="absolute z-10 w-3/4 h-60 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-900 delay-150 group-hover:delay-75"></div>
        <div className="absolute z-10 w-2/3 h-50 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-800 delay-150 group-hover:delay-100"></div>
        <div className="absolute z-10 w-7/12 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-700 delay-150 group-hover:delay-150"></div>
        <div className="absolute z-10 w-1/2 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-600 delay-150 group-hover:delay-200"></div>
        <div className="absolute z-10 w-5/12 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-500 delay-150 group-hover:delay-300"></div>
        <div className="absolute z-10 w-4/12 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-400 delay-150 group-hover:delay-300"></div>
        <div className="absolute z-10 w-3/12 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-300 delay-150 group-hover:delay-300"></div>
        <div className="absolute z-10 w-2/12 h-20 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-green-200 delay-150 group-hover:delay-300"></div>
        <p className="z-10 text-xl text-stone-700">Start Analyzing</p>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
          
          {/* Popup Window */}
          <div className="w-2/3 h-3/4 bg-white p-4 rounded-lg shadow-lg">

            <div className=''>

            </div>

            <h2 className="text-3xl font-bold mb-4 text-stone-700">Upload Your Image</h2>

            <form className='h-full'>
               
               {/* Picture file input */}
              <div className="w-full flex-col items-center justify-center h-3/4">
                <div className="flex w-full items-center justify-between">
                  
                  {/* Upload button */}
                  <div className=' scale-150 flex h-30 w-1/3 items-center rounded-md border-input px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium'>
                    <label className="flex bg-emerald-500 hover:bg-emerald-700 text-white text-base px-5 py-3 outline-none rounded w-max cursor-pointer mx-auto font-[sans-serif]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2 fill-white inline" viewBox="0 0 32 32">
                      <path
                        d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                        data-original="#000000" />
                      <path
                        d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                        data-original="#000000" />
                    </svg>
                    Upload
                    <input type="file" id='uploadFile1' className="hidden" onChange={(e) => {
                                                      e.preventDefault();
                                                      handleImageChange(e); }} />
                    </label>
                  </div>
                  <div className="flex w-1/3 h-80 bg-gray-200 border border-black">
                      {image && (
                        <img src={URL.createObjectURL(image)} alt="No Image Selected" className='max-w-full max-h-full object-fill'/>
                      )}
                  </div>
                </div>
                <div className="text-black justify-start text-left text-6xl pt-12">
                   {response}
                </div>
              </div>
              <button type="button" onClick={(e) => {e.preventDefault(), handleSubmission();}} className="bg-emerald-500 text-white py-2 px-4 rounded-md hover:bg-emerald-800">Analyze</button>
              <CloseButton onClick={() => {closeModal(); changeImage(null);}}/>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popout;
