// components/ImageList.tsx

import React from 'react';

interface ImageListProps {
  images: [string, string][];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="flex flex-col p-4 h-full space-y-4">
      {images.map(([imageURL, desc], index) => (
        <div key={index} className="mb-4 overflow-y-auto">
          <img
            src={imageURL}
            alt={desc}
            className="rounded-lg shadow-lg text-base"
            style={{ width: '300px', height: 'auto' }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageList;
