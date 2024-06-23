// components/ImageList.tsx

import React from "react";

interface ImageListProps {
  images: [string, string][];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="flex flex-col p-4 h-full space-y-4">
      {images.map(([tag, desc], index) => (
        <div key={index} className="mb-4 overflow-y-auto">
          <div className="justify-start text-left">
            <div className="pb-4 text-3xl">Result: {tag}</div>
          </div>
          <div className="text-base w-3/4 border-2 p-2 border-emerald-200 bg-emerald-100 rounded-lg">
            {desc}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageList;
