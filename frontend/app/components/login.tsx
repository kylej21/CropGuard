"use client";
import React, { useState } from "react";
import CloseButton from "./close_button";

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
  const [response, setResponse] = useState("Welcome!");
  const [logClassName, setLogClassName] = useState(
    "px-2 italic -mx-2 text-green-500",
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setLogClassName("px-2 italic -mx-2 text-green-500");
    setResponse("Welcome!");
    setIsModalOpen(false);
  };

  const passwordIsValid = () => {
    return !["", "password"].includes(password);
  };

  const usernameIsValid = () => {
    return !["", "Login", "null", "username"].includes(username);
  };

  const logInOrOut = () => {
    if (loggedUser === "Login") {
      setIsModalOpen(true);
    } else {
      setLoggedUser("Login");
      setUsername("");
      setPassword("");
      setLogClassName("px-2 italic -mx-2 text-green-500");
      onLogout(); // Update isLoggedIn state in parent component
    }
  };

  const submitForm = () => {
    if (!usernameIsValid() || !passwordIsValid()) return;

    // prepare POST request
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    fetch("http://127.0.0.1:5000/login/", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data["status"] === "logged in") {
          setLoggedUser("Logout");
          onLogin(username); // Update isLoggedIn state in parent component
          closeModal();
        } else if (data["status"] === "Account created") {
          setResponse(data["status"]);
          setLogClassName("px-2 italic -mx-2 text-red-500");
        } else {
          setResponse(data["status"]);
          setLogClassName("px-2 italic -mx-2 text-red-500");
        }
      });
  };

  return (
    <div className="w-screen flex items-right justify-right">
      <div className="ml-auto w-1/4 p-4">
        {" "}
        {/* Added div with ml-auto class for right alignment */}
        <button
          className="border-black bg-emerald-700 border-2 justify-right text-center w-full p-4 rounded-lg hover:bg-emerald-800 text-4xl text-white"
          onClick={logInOrOut}
        >
          <b>{loggedUser}</b>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black bg-opacity-75">
          {/* Popup Window */}
          <div className="w-2/3 h-3/4 bg-white p-4 rounded-lg shadow-lg">
            <div
              id="login"
              className="items-center w-full h-full bg-green-50 rounded shadow flex flex-col justify-between between p-3"
            >
              <div className="text-green-500 h-full">
                <div className="border-4 border-dotted border-green-500 p-5 h-full space-y-12">
                  <legend id="logtitle" className={logClassName}>
                    {response}
                  </legend>
                  <label className="text-m font-bold after:content-['*'] after:text-red-400">
                    Username{" "}
                  </label>
                  <input
                    className="w-full p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-green-500"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <label className="text-m font-bold after:content-['*'] after:text-red-400">
                    Password{" "}
                  </label>
                  <input
                    className="w-full p-2 mb-2 mt-1 outline-none ring-none focus:ring-2 focus:ring-green-500"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    className="w-full rounded bg-green-500 text-indigo-50 p-2 text-center font-bold hover:bg-green-400"
                    onClick={submitForm}
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CloseButton onClick={closeModal} />
        </div>
      )}
    </div>
  );
};

export default Login;
