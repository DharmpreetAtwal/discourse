import React, { useState, useEffect } from "react";
import Friend from "./Friend";
import { useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

function Home({ userID, setIsAuth }) {
  const [groupID, setGroupID] = useState(null);
  const groupIDInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (groupID !== null) {
      navigate("/group/:" + groupID);
    }
  }, [groupID]);

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
        Sign Out
      </button>
      <h2> Enter Your GroupID Name</h2>
      <input ref={groupIDInputRef} className="bg-orange-500" />
      <button
        onClick={() => setGroupID(groupIDInputRef.current.value)}
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
