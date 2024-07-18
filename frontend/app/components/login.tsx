"use client";
import React, { useState } from "react";
import CloseButton from "./close_button";
import { useSnackbar } from 'notistack';
import { CiCircleInfo } from "react-icons/ci";
import Tooltip from "./Tooltip";
import { request } from "http";
interface LoginProps {
  isLoggedIn: boolean;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

const Login: React.FC<LoginProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedUser, setLoggedUser] = useState("Login");
  const [logClassName, setLogClassName] = useState(
    "px-2 italic -mx-2 text-green-500",
  );
  const [loggingIn, setLoggingIn] = useState(true);
  const snackbar = useSnackbar();

  const changeLoggingStatus = () => {
    setLoggingIn(!loggingIn);
    setUsername("");
    setPassword("");
  }
  const closeModal = () => {
    setLogClassName("px-2 italic -mx-2 text-green-500");
    setIsModalOpen(false);
  };

  const passwordIsValid = () => {
    if( password==""){
      if(loggingIn){
        snackbar.enqueueSnackbar('Incorrect password or username!', { variant: 'error', autoHideDuration: 2000 });
      }
      else{
        snackbar.enqueueSnackbar('Password cannot be empty!', { variant: 'error', autoHideDuration: 2000 });
      } 
      return false;
    }
    else if(password=="password" || password.length<6){
      if(loggingIn){
        snackbar.enqueueSnackbar('Incorrect password or username!', { variant: 'error', autoHideDuration: 2000 });
      }else{
        snackbar.enqueueSnackbar('Password too simple!', { variant: 'error', autoHideDuration: 2000 });
      }
      return false;
    }
    return true;
  };

  const usernameIsValid = () => {

    if (["", "Login", "null", "username"].includes(username)){
      if(loggingIn){
        snackbar.enqueueSnackbar('Incorrect password or username!', { variant: 'error', autoHideDuration: 2000 });
        return false;
      }
      else{
        snackbar.enqueueSnackbar('Username taken!', { variant: 'error', autoHideDuration: 2000 });
        return false;
      }
    };
    return true;
  };

  const logInOrOut = () => {
    if (loggedUser === "Login") {
      setIsModalOpen(true);
      setLoggingIn(true);
      setUsername("");
      setPassword("");
    } else {
      setLoggedUser("Login");
      setUsername("");
      setPassword("");
      setLogClassName("px-2 italic -mx-2 text-green-500");
      onLogout(); // Update isLoggedIn state in parent component
      snackbar.enqueueSnackbar('Logged Out!', { variant: 'success', autoHideDuration: 2000 });
    }
  };

  const submitForm = () => {
    if (!usernameIsValid()) return;
    if (!passwordIsValid()) return;
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username: username, password: password })
    };
    if(loggingIn){
      fetch("/api/users", requestOptions)
      .then((data) => {
        console.log("frontend data", data)
        if (data.status==200) {
          snackbar.enqueueSnackbar('Login Successful!', { variant: 'success', autoHideDuration: 2000 });
          setLoggedUser("Logout");
          onLogin(username); // Update isLoggedIn state in parent component
          closeModal();
        } 
        //else if (data["status"] === "Account created") {
          //snackbar.enqueueSnackbar('Account Created!', { variant: 'success', autoHideDuration: 2000 });
        //} 
        else {
          snackbar.enqueueSnackbar('Incorrect Username or Password', { variant: 'error', autoHideDuration: 2000 });}
      });
    }else{
      fetch("http://127.0.0.1:5000/create/", requestOptions)
      .then((res)=> res.json())
      .then((data)=> {
        if (data["status"] === "Account created") {
          snackbar.enqueueSnackbar('Account Created!', { variant: 'success', autoHideDuration: 2000 });
          closeModal();
          setLoggingIn(true);
          setLoggedUser("Logout");
          onLogin(username); // Update isLoggedIn state in parent component

        } 
        else {
          snackbar.enqueueSnackbar('Username Taken!', { variant: 'error', autoHideDuration: 2000 });}
      })
    }
    
  };

  return (
    <div className="w-screen flex items-right justify-center lg:justify-end">
    <div className="ml-auto w-5/12 lg:w-1/4 p-4">
      <button
        className="border-black bg-emerald-700 border-2 justify-right text-center w-full p-4 rounded-lg hover:bg-emerald-800 text-xl lg:text-4xl text-white"
        onClick={logInOrOut}
      >
        <b>{loggedUser}</b>
      </button>
    </div>
  
    {isModalOpen && (
      <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
        <div className="w-1/2 h-5/6 bg-white p-4 rounded-lg shadow-lg">
          {loggingIn && (
            <div className="flex flex-col h-full">
              <div className="text-green-500 h-full">
                <div className=" border-dotted border-green-500 p-2 h-full flex flex-col justify-around">
                  <label className="text-m font-bold py-2">
                    Username
                  </label>
                  <input
                    className="p-2 mb-2 mt-1 outline-none ring-2 ring-green-500"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label className="text-m font-bold py-4">
                    Password
                  </label>
                  <input
                    className="p-2 mb-2 mt-1 outline-none ring-2 ring-green-500"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="w-full rounded bg-green-500 text-indigo-50 p-2 text-center font-bold hover:bg-green-400"
                    onClick={submitForm}
                  >
                    Log In
                  </button>
                  <div className="text-4xl">
                    <b>or...</b>
                  </div>
                  <button className="text-6xl hover:underline" onClick={changeLoggingStatus}>
                    <b>Create account</b>
                  </button>
                </div>
              </div>
            </div>
          )}
          {!loggingIn && (
            <div className="flex flex-col h-full">
              <div className="text-green-500 h-full">
                <div className=" border-dotted border-green-500 p-2 h-full flex flex-col justify-around">
                  <label className="text-m font-bold py-2">
                    Username
                  </label>
                  <input
                    className="p-2 mb-2 mt-1 outline-none ring-2 ring-green-500"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label className="flex items-center justify-center text-m font-bold py-4">
                    <span className="flex items-center">
                      Password
                      <Tooltip message="Password must be at least 8 characters">
                        <CiCircleInfo className="h-8 w-8 ml-2" />
                      </Tooltip>                    
                    </span>
                  </label>
                  <input
                    className="p-2 mb-2 mt-1 outline-none ring-2 ring-green-500"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="w-full rounded bg-green-500 text-indigo-50 p-2 text-center font-bold hover:bg-green-400"
                    onClick={submitForm}
                  >
                    Create
                  </button>
                  <div className="text-4xl">
                    <b>or...</b>
                  </div>
                  <button className="text-6xl hover:underline" onClick={changeLoggingStatus}>
                    <b>Login</b>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <CloseButton onClick={closeModal} />
      </div>
    )}
  </div>
  );
};

export default Login;
