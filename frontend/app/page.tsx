'use client'
import Image from "next/image";
import { motion } from "framer-motion"
import React, { useState, useEffect, useRef } from "react";
import { AlertDialog, Text, Button, Flex } from '@radix-ui/themes';
import Popout from "./components/popout"
import {title_font} from './fonts'
export default function Home() {

  let [image, changeImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      changeImage(event.target.files[0]);
    }
  }
  return (
    <div>
      
        <div className="z-10 w-screen h-screen items-center justify-around font-mono text-sm lg:flex-col bg-[url('./public/stock_forest_beige.jpg')] bg-cover bg-no-repeat bg-center">
            <div className="h-3/4 text-8xl text-black w-full text-center flex-col">
              <div className="h-1/4">
                {/*placeholder */}
              </div>

              {/* Title */}
              <div className={`hover:scale-110 transition-all ease-in-out ${title_font.className}`}>
                <b>Faulty Farming</b>
              </div>
              
              <div className="h-3/4 flex text-white items-center justify-center text-center align-middle">
              

              {/* Sometimes u gotta */}
              <Popout/>
              {/* and show them */}
      
              </div>
            </div>
        </div>
        <div className ="flex-col bg-stone-800 h-screen items-center justify-center text-center text-6xl p-20 space-y-20">
            <b> About Faulty Farming</b>
            <div className="flex items-center justify-center text-center text-2xl">
              <p className="w-2/3">Faulty Farming is a project that utilizes cutting edge computer vision technology to empower farmers. By classifying crops, we enable farmers to focus on sustainable agriculture practices. </p>
            </div>
            <div>
              <b> Tech</b>
            </div>
            <div className="flex items-center justify-center text-center text-2xl">
              <p className="w-2/3">We utilized Next.js, Tailwind CSS, and TypeScript for our frontend, incorporating various UI frameworks. Our Python backend hosts an ML model built with PyTorch and stores data on AWS.</p>
            </div>
        </div>
        </div>
  );
}
