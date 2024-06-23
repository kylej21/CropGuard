import React, { useEffect, useRef } from "react";

interface Base64ImageProps {
  base64String: string;
}

const Base64Image: React.FC<Base64ImageProps> = ({ base64String }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = `data:image/png;base64,${base64String}`;
    }
  }, [base64String]);

  return <img ref={imageRef} alt="Loaded from base64" />;
};

export default Base64Image;
