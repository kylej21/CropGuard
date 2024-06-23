'use client'
import { useState } from 'react';
import Image from 'react';


interface SubmissionResultProps
{
    image: File,
    description: string,
}


function SubmissionResult({ image, description = "No description available."}: SubmissionResultProps)
{
    let img_url = URL.createObjectURL(image);

    return (
        <div>
            <img src={img_url} alt="No image" />
            <p>{description}</p>
        </div>
    );
}

export default SubmissionResult;