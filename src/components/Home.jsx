import React from "react";
import Friend from "./Friend";
import { useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

function Home({ userID, setIsAuth }) {
  const navigate = useNavigate();

  const groupInputRef = useRef(null);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setIsAuth(false);
        navigate("/");
        cookies.remove("uid", { path: "/" });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <button onClick={handleSignOut} className="bg-red-500">
        {" "}
        Sign Out{" "}
      </button>
      <h2> Enter Your Group Name</h2>
      <input ref={groupInputRef} className="bg-orange-500" />
      <button
        onClick={() => setGroup(groupInputRef.current.value)}
        className="bg-red-500"
      >
        Enter Discourse
      </button>
      {console.log(userID)}
      <Friend userID={userID} />
    </div>
  );
}

export default Home;
