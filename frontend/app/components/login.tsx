"use client";
import React, { useState } from "react";
import CloseButton from "./close_button";
import { useSnackbar } from 'notistack';

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
    // prepare POST request
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };
    if(loggingIn){
      fetch("http://127.0.0.1:5000/login/", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data["status"] === "logged in") {
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
        {" "}
        {/* Added div with ml-auto class for right alignment */}
        <button
          className="border-black bg-emerald-700 border-2 justify-right text-center w-full p-4 rounded-lg hover:bg-emerald-800 text-xl lg:text-4xl text-white"
          onClick={logInOrOut}
        >
          <b>{loggedUser}</b>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
          {/* Popup Window */}
          <div className="w-2/3 h-3/4 bg-white p-4 rounded-lg shadow-lg">
            {/* Popup Content */}
            {loggingIn && (
            <div
              id="login"
              className="items-center w-full h-full bg-green-50 rounded shadow flex flex-col justify-between between p-3"
            >
              <div className="text-green-500 h-full">
                <div className="border-4 border-dotted border-green-500 p-5 h-full space-y-4">
                  <label className="text-m font-bold after:content-['*'] after:text-red-400 py-4">
                    Username{" "}
                  </label>
                  <input
                    className="w-3/4 p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-green-500" 
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <label className="text-m font-bold after:content-['*'] after:text-red-400 py-4">
                    Password{" "}
                  </label>
                  <input
                    className="w-3/4 p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-green-500"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    className="w-3/5 rounded bg-green-500 text-indigo-50 p-2 text-center font-bold hover:bg-green-400"
                    onClick={submitForm}
                  >
                    Log In
                  </button>
                  <div className="text-4xl">
                    <b>or...</b>
                  </div>
                  <button className='text-6xl hover:underline'
                  onClick={changeLoggingStatus}>
                    <b>Create a new account</b>
                  </button>
                  
                </div>
              </div>
            </div>
            )}
            {!loggingIn && (
              <div
              id="login"
              className="items-center w-full h-full bg-green-50 rounded shadow flex flex-col justify-between between p-3"
            >
              <div className="text-green-500 h-full">
                <div className="border-4 border-dotted border-green-500 p-5 h-full space-y-4">
                  <label className="text-m font-bold after:content-['*'] after:text-red-400 py-4">
                    Username{" "}
                  </label>
                  <input
                    className="w-3/4 p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-green-500" 
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <label className="text-m font-bold after:content-['*'] after:text-red-400 py-4">
                    Password{" "}
                  </label>
                  <input
                    className="w-3/4 p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-green-500"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    className="w-3/5 rounded bg-green-500 text-indigo-50 p-2 text-center font-bold hover:bg-green-400"
                    onClick={submitForm}
                  >
                    Create
                  </button>
                  <div className="text-4xl">
                    <b>or...</b>
                  </div>
                  <button className='text-6xl hover:underline'
                  onClick={changeLoggingStatus}>
                    <b>Login instead</b>
                  </button>
                </div>
              </div>
            </div>
            )
            }
          </div>
          <CloseButton onClick={closeModal} />
        </div>
      )}
    </div>
  );
};

export default Login;
