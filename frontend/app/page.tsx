"use client";
import Image from "next/image";
import React, { useState } from "react";
import Popout from "./components/popout";
import Login from "./components/login";
import { title_font } from "./fonts";
import title from "./public/newTitle.png";
import Dash from "./components/dashboard";
import Link from "next/link"
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>("");

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <div>
      <div className="z-10 w-screen h-screen items-center justify-around font-mono text-sm lg:flex-col bg-[url('./public/grassback.jpg')] bg-cover bg-no-repeat bg-center">
        <div className="h-3/4 text-8xl text-black w-full text-center flex-col">
          <div className="flex-col h-1/4 w-screen">
            <div className="flex w-full">
              <div className="flex items-start justify-start p-2 w-1/2">
                {/* Placeholder */}
              </div>
              <div className="flex items-start justify-end p-2 w-1/2">
                <div className="text-6xl text-black">
                  <div id="login" className="text-gray-500 hover:text-gray-700 smLt">
                    <Login
                      isLoggedIn={isLoggedIn}
                      onLogin={handleLogin}
                      onLogout={handleLogout}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Title */}
          <div
            className={`flex justify-center w-screen hover:scale-110 transition-all ease-in-out ${title_font.className}`}
          >
            <Image
              src={title}
              width={300}
              height={300}
              alt="Faulty Farming"
              className="justify-cente w-2/3"
            />
          </div>
          <div className="h-3/4 flex text-white items-center justify-center text-center align-middle">
            {/* Content */}
            {isLoggedIn && <Popout username={username} />}
          </div>
        </div>
      </div>

      {/* About Faulty Farming Section */}
      <div className="flex-col bg-stone-800 h-auto items-center justify-center text-center text-6xl p-10 lg:p-20 space-y-20 w-screen text-white">
        <div className="flex justify-center w-full items-center">
          <div className=" w-full lg:w-1/2 pb-12">
            {isLoggedIn && <Dash username={username} />}
          </div>
        </div>
        <div>
          
        </div>
        <b className="text-5xl lg:text-6xl"> About Crop Guard</b>
        <div className="flex items-center justify-center text-center text-2xl bg-stone-800 ">
          <p className="w-11/12 lg:w-2/3">
            Crop Guard is a project that utilizes{" "}
            <b>cutting edge computer vision </b>
            technology to identify unhealthy crops, enabling farmers to focus on{" "}
            <b>sustainable</b> agriculture practices. As a{" "}
            <u>220 billion dollar</u> industry, sustainable agriculture is in
            clear need of innovation.<br></br>
            <br></br>Our goal is to provide{" "}
            <b>actionable, data-centric feedback </b>
            that enables farmers to minimize pesticide use and empowers them to
            focus on sustainable agriculture principles.
          </p>
        </div>
        <div className="flex items-center justify-center text-center text-2xl bg-stone-800 ">
          <p className="w-11/12 lg:w-2/3">
            We utilized Next.js, Tailwind CSS, and TypeScript for our frontend,
            incorporating various UI frameworks. Our FastAPI backend hosts a
            PyTorch ML model and stores data with SQLite.
          </p>
        </div>
        <div className="bg-stone-800 text-center">
          <p className="text-2xl lg:text-3xl text-white w-11/12 lg:w-2/3 mx-auto mb-8">
            Don't want to upload images? Go live using your webcam below!
          </p>
          <div className="flex justify-center">
            <Link href="/live">
              <div className="bg-red-500 text-white py-4 px-8 lg:py-6 lg:px-12 rounded-lg border border-white hover:bg-red-600 transition duration-300 ease-in-out">
                Go Live!
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
