import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, rtDB } from "../config/firebase";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { useRef } from "react";
import Friend from "./Friend";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, set } from "firebase/database";
import { useSetIsOnline } from "../hooks/useSetIsOnline";

const cookies = new Cookies();

function Home({ userID, setIsAuth }) {
  const [groupID, setGroupID] = useState(null);
  const groupIDInputRef = useRef(null);

  const navigate = useNavigate();
  const { setIsOnline } = useSetIsOnline();

  useEffect(() => {
    if (groupID !== null) {
      navigate("/group/" + groupID);
    }
  }, [groupID]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setIsAuth(false);
        navigate("/");

        cookies.remove("uid", { path: "/" });

        setIsOnline(userID, false);
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
      <Friend userID={userID} />
    </div>
  );
}

export default Home;
