import { useState, useRef, useEffect } from "react";
import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
import Friend from "./components/Friend";
import { Chat } from "./components/Chat";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("token-auth"));
  const [userID, setUserID] = useState(cookies.get("uid"));

  const [group, setGroup] = useState(null);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Auth setIsAuth={setIsAuth} setUserID={setUserID} />}
          />
          <Route
            path="home"
            element={<Home userID={userID} setIsAuth={setIsAuth} />}
          />
        </Routes>
      </Router>
      {/*<div>
        <button onClick={handleSignOut} className="bg-red-500">
          {" "}
          Sign Out{" "}
        </button>
        {group ? (
          <div>
            <Chat group={group} />
          </div>
        ) : (
          <div>
            <h2> Enter Your Group Name</h2>
            <input ref={groupInputRef} className="bg-orange-500" />
            <button
              onClick={() => setGroup(groupInputRef.current.value)}
              className="bg-red-500"
            >
              Enter Discourse
            </button>
            <Friend userID={userID} />
          </div>
        )}
      </div>*/}
    </>
  );
}

export default App;
