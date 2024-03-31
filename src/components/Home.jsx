import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { useRef } from "react";
import Friend from "./Friend";
import { useSetIsOnline } from "../hooks/useSetIsOnline";
import { useGetPublicGroups } from "../hooks/home/useGetPublicGroups";
import { useCreateGroup } from "../hooks/useCreateGroup";
import { useSetOpenGroup } from "../hooks/useSetOpenGroup";

const cookies = new Cookies();

function Home({ userID, setIsAuth }) {
  const [publicGroups, setPublicGroups] = useState([]);
  const groupIDInputRef = useRef(null);

  const navigate = useNavigate();
  const { setIsOnline } = useSetIsOnline();
  const { getPublicGroups } = useGetPublicGroups();
  const { createGroup } = useCreateGroup();
  const { setOpenGroup } = useSetOpenGroup();

  const navigateGroup = (groupID) => {
    if (groupID !== null) {
      setOpenGroup(userID, groupID);
      navigate("/group/" + groupID);
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      const output = await getPublicGroups(userID);
      setPublicGroups(output);
    };

    handleFetch();
  }, []);

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

  const handleCreateGroupBtn = () => {
    createGroup(userID, [], false).then((doc) => {
      navigateGroup(doc.id);
    });
  };

  const isLatestMessageRead = (group) => {
    const lastOpened = group.data.lastOpenedByUser[userID];
    if (lastOpened) {
      //try {
      if (group.latestMessage) {
        const latestMessageTime = group.latestMessage.data().createdAt.toDate();
        return latestMessageTime.getTime() < lastOpened.toDate().getTime();
      }

      //} catch (error) {
      //  console.error(group.id + " doesn't have latestMessage");
      //  console.log(group.data);
      //}

      // If the user has opened the group after the latest msg was sent, return true
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
            {publicGroups.length > 0 && <Friend userID={userID} />}
          </div>
          <div className="w-2/3 overflow-auto no-scrollbar">
            {publicGroups.map((group) => {
              return (
                <div className="flex flex-row w-full h-16" key={group.id}>
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
                        {group.latestMessage
                          ? group.latestMessage.data().sentBy
                          : "NONE"}
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-green-500 w-1/3"
                    onClick={() => navigateGroup(group.id)}
                  >
                    Join Public Group
                  </button>
                </div>
              );
            })}
            <div className="w-9 h-9">
              <button
                onClick={handleCreateGroupBtn}
                className="bg-orange-500 w-full h-full"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2> Enter Your GroupID Name</h2>
        <input ref={groupIDInputRef} className="bg-orange-500" />
        <button
          onClick={() => navigateGroup(groupIDInputRef.current.value)}
          className="bg-red-500"
        >
          Enter Discourse
        </button>
      </div>
    </>
  );
}

export default Home;
