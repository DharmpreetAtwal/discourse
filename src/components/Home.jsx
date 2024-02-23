import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { useRef } from "react";
import Friend from "./Friend";
import { useSetIsOnline } from "../hooks/useSetIsOnline";
import { useGetPublicGroups } from "../hooks/useGetPublicGroups";

const cookies = new Cookies();

function Home({ userID, setIsAuth }) {
  const { publicGroups } = useGetPublicGroups(userID);
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

  const isLatestMessageRead = (group) => {
    const lastOpened = group.data.lastOpenedByUser[userID];
    if (lastOpened) {
      const latestMessageTime = group.latestMessage.data().createdAt.toDate();

      // If the user has opened the group after the latest msg was sent, return true
      return latestMessageTime.getTime() < lastOpened.toDate().getTime();
    }
    return false;
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row bg-orange-500 h-[10vh] min-w-full p-4 justify-between">
          <div></div>
          <div className="bg-blue-300">{userID}</div>
          <div className="flex">
            <div className="bg-blue-500 w-3 h-3"></div>
            <button onClick={handleSignOut} className="bg-red-500">
              Sign Out
            </button>
          </div>
        </div>
        <div className="flex flex-row bg-slate-200 h-[90vh] min-w-screen">
          <div className="flex flex-col w-1/3 bg-slate-600">
            <Friend userID={userID} />
          </div>
          <div className="w-2/3">
            {console.log(publicGroups)}
            {publicGroups.map((group) => {
              return (
                <div className="flex flex-row w-full h-12" key={group.id}>
                  <div className="bg-purple-500 w-2/3">
                    {group.id}
                    {isLatestMessageRead(group) ? (
                      <div>
                        Last Opened:
                        {group.data.lastOpenedByUser[userID]
                          .toDate()
                          .toString()}
                      </div>
                    ) : (
                      <div>
                        New Latest Message from:{" "}
                        {group.latestMessage.data().sentBy}
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-green-500 w-1/3"
                    onClick={() => setGroupID(group.id)}
                  >
                    Join Public Group
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <h2> Enter Your GroupID Name</h2>
        <input ref={groupIDInputRef} className="bg-orange-500" />
        <button
          onClick={() => setGroupID(groupIDInputRef.current.value)}
          className="bg-red-500"
        >
          Enter Discourse
        </button>
      </div>
    </>
  );
}

export default Home;
