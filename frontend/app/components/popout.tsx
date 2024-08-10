import { useState } from "react";
import Image from "react";
import CloseButton from "./close_button";
import { TbBinaryTree } from "react-icons/tb";

interface DashProps {
  username: string;
  onOpenModal: () => void;
}
function Popout({ username ,onOpenModal}: DashProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [image, changeImage] = useState<File | null>(null);
  let [response, changeResponse] = useState("Upload an image of the plant you want a diagnosis for and click analyze to start!");
  let [loading, changeLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      changeImage(event.target.files[0]);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    onOpenModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onOpenModal();
    changeResponse("Upload an image of the plant you want a diagnosis for and click analyze to start!");
  };

  async function handleSubmission() {
    if (loading || !image) return;

    changeLoading(true);
    console.log("Submitting: " + image);

    // body of POST request to send image
    const formData = new FormData();
    formData.append("file", image, image.name);
    formData.append("extension", image.name.split(".").pop() || "");
    formData.append("username", username);
    console.log(image.name);

    // make post request, and display prompt result
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    await fetch('http://127.0.0.1:5000/upload/', requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data["status"] === "healthy") {
          changeResponse("No threat! Plant is Healthy!");
        } else {
          changeResponse(
            "Threat: " + data["status"] + ". " + data["explanation"]
          );
        }
      });
    changeLoading(false);
  }

  return (
    <div className="w-screen flex justify-center items-center h-screen">
      <button
        className="w-4/5 lg:w-2/5 relative border-4 hover:border-green-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-20 rounded-lg bg-green-800 p-2 flex justify-center items-center font-extrabold"
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
        <div className="fixed inset-0 z-50 h-5/6 lg:h-full flex items-center justify-center bg-black bg-opacity-75">
          {/* Popup Window */}
          <div className="w-full lg:w-2/3 h-4/5 bg-white p-4 rounded-lg shadow-lg overflow-hidden">
            {/* Loading screen */}
            {loading && (
              <div className="flex items-center justify-center h-full lg:h-full">
                <div className="flex-col gap-4 w-full flex items-center justify-around">
                  {/* tuff binary tree */}

                  <div className="text-green-400 text-4xl">
                    <b className="text-black">Loading...</b>
                    <br></br>
                    <br></br>
                    <b>Fun fact: Binary trees are used in both linguistics and computer science </b>
                  </div>
                  <div className="w-80 h-80 border-8 text-green-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-green-400 rounded-full">
                    <TbBinaryTree className="w-40 h-40" />
                  </div>
                </div>             
              </div>
            )}
            {!loading && (
              <h2 className="text-3xl font-bold mb-4 text-stone-700">
                Upload Your Image
              </h2>
            )}

            <form className="h-4/5 lg:h-full flex flex-col justify-around">
              {/* Picture file input */}
              <div className="w-full flex items-center justify-between h-2/3">
                <div className="flex-col w-3/5">
                  {/* Upload button */}
                  {!loading && (
                    <div className="flex h-24 w-full items-center rounded-md border-input px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium">
                      <label className="flex bg-emerald-500 hover:bg-emerald-700 text-white text-2xl px-5 py-3 outline-none rounded w-3/5 lg:w-max cursor-pointer mx-auto font-[sans-serif] justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 mr-2 fill-white inline"
                          viewBox="0 0 32 32"
                        >
                          <path
                            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                            data-original="#000000"
                          />
                          <path
                            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                            data-original="#000000"
                          />
                        </svg>
                        Upload
                        <input
                          type="file"
                          id="uploadFile1"
                          className="hidden"
                          onChange={(e) => {
                            e.preventDefault();
                            handleImageChange(e);
                          }}
                        />
                      </label>
                    </div>
                  )}
                  <div className="text-black justify-center text-lg lg:text-2xl p-6 overflow-y-auto max-h-1/2">
                      {response}
                    </div>
                </div>
                {!loading && (
                  <div className="flex w-1/3 h-40 lg:h-80 bg-gray-200 border border-black">
                    {/* Image preview */}
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="No Image Selected"
                        className="max-w-full max-h-full object-fill"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Analyze button */}
              <button
                type="button"
                onClick={handleSubmission}
                className="mb-8 bg-emerald-500 text-white text-4xl font-bold lg:text-5xl py-4 px-6 rounded-md hover:bg-emerald-800 w-full lg:w-3/5 h-20 lg:h-auto max-h-20 self-center"
              >
                Analyze
              </button>
              <CloseButton onClick={closeModal} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Popout;
