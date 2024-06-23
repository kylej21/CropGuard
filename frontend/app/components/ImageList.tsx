// components/ImageList.tsx

import React from 'react';

interface ImageListProps {
  images: string[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="flex flex-col overflow-y-auto p-4 h-full space-y-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="mb-4">
          <img
            src={imageUrl}
            alt={`Image ${index}`}
            className="rounded-lg shadow-lg"
            style={{ width: '300px', height: 'auto' }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageList;
