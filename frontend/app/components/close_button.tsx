'use client'
import { useState } from 'react';
import Image from 'react';

interface CloseButtonProps {
    onClick: () => void;
  }

function CloseButton({ onClick }: CloseButtonProps)
{
    return (
        <div className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <button
                className="relative border-2 border-black group hover:border-green-500 w-12 h-12 duration-500 overflow-hidden"
                type="button"
                onClick={onClick}>
                <p
                    className="font-Manrope text-3xl h-full w-full flex items-center justify-center text-white duration-500 relative z-10 group-hover:scale-0"
                >
                    ×
                </p>
                <span
                    className="absolute w-full h-full bg-green-500 rotate-45 group-hover:top-9 duration-500 top-12 left-0"
                ></span>
                <span
                    className="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:left-9 duration-500 left-12"
                ></span>
                <span
                    className="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:right-9 duration-500 right-12"
                ></span>
                <span
                    className="absolute w-full h-full bg-green-500 rotate-45 group-hover:bottom-9 duration-500 bottom-12 right-0"
                ></span>
            </button>
        </div>
    )
}

CloseButton.defaultProps = {
    onClick: () => {},
};

export default CloseButton;