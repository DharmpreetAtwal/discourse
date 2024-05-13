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
import useSetGroupLastOpenByUser from "../hooks/useSetGroupLastOpenByUser";

const cookies = new Cookies();

function Home({ userID, setIsAuth, displayName, photoURL }) {
  const [publicGroups, setPublicGroups] = useState([]);
  const [fetchedPublicGroups, setFetchedPublicGroups] = useState(false);

  const groupIDInputRef = useRef(null);

  const navigate = useNavigate();
  const { setIsOnline } = useSetIsOnline();
  const { getPublicGroups } = useGetPublicGroups();
  const { createGroup } = useCreateGroup();
  const { setOpenGroup } = useSetOpenGroup();
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();

  const navigateGroup = (groupID) => {
    if (groupID !== null) {
      setOpenGroup(userID, groupID);
      setGroupLastOpenByUser(userID, groupID);
      navigate("/group/" + groupID);
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      const output = await getPublicGroups(userID);
      setPublicGroups(output);
      setFetchedPublicGroups(true);
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
      if (group.latestMessage) {
        const latestMessageTime = group.latestMessage.data().createdAt.toDate();
        return latestMessageTime.getTime() < lastOpened.toDate().getTime();
      } else {
        console.log("No Latest Msg");
      }

      // If the user has opened the group after the latest msg was sent, return true
    } else {
      console.log("User has never opened before");
    }
    return false;
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row bg-orange-500 h-[10vh] min-w-full p-4 justify-between">
          <div>
            <img
              className="max-h-full shadow-xl rounded-full"
              src={`${photoURL}`}
            />
          </div>
          <div className="flex bg-blue-300 w-1/5 rounded-2xl shadow-xl text-3xl items-center justify-center">
            <p>{displayName}</p>
          </div>
          <div className="flex">
            <button
              onClick={handleSignOut}
              className="rounded-3xl px-4 drop-shadow-md text-3xl bg-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex flex-row bg-slate-200 h-[90vh] min-w-screen">
          <div className="flex flex-col w-1/3 bg-slate-600">
            {fetchedPublicGroups && <Friend userID={userID} />}
          </div>
          <div className="flex flex-col w-2/3 h-full overflow-auto items-center">
            {publicGroups.map((group) => {
              return (
                <div className="flex flex-row w-11/12 m-1" key={group.id}>
                  <div className="flex flex-row bg-purple-500 justify-between items-center w-full px-3 h-16 rounded-l-3xl text-2xl shadow-md">
                    {group.id}
                    {isLatestMessageRead(group) ? (
                      <div className="flex text-neutral-700 bg-amber-500 h-1/2 items-center justify-center px-2 rounded-lg">
                        <p>
                          {group.data.lastOpenedByUser[userID]
                            .toDate()
                            .toDateString()
                            .toString() +
                            " " +
                            group.data.lastOpenedByUser[userID]
                              .toDate()
                              .toLocaleTimeString()
                              .toString()}
                        </p>
                      </div>
                    ) : (
                      <div className="flex bg-emerald-700 text-lime-400 h-1/2 justify-center items-center px-2 rounded-lg text-xl">
                        New:{" "}
                        {group.latestMessage
                          ? group.latestMessage.data().sentBy
                          : "NO ONE"}
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-green-500 w-1/6 h-full rounded-r-3xl text-2xl shadow-lg"
                    onClick={() => navigateGroup(group.id)}
                  >
                    Join
                  </button>
                </div>
              );
            })}
            <div className="w-1/3 h-9">
              <button
                onClick={handleCreateGroupBtn}
                className="bg-lime-500 rounded-3xl drop-shadow-md w-full h-full"
              >
                + Add a New Group
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*<div>
        <h2> Enter Your GroupID Name</h2>
        <input ref={groupIDInputRef} className="bg-orange-500" />
        <button
          onClick={() => navigateGroup(groupIDInputRef.current.value)}
          className="bg-red-500"
        >
          Enter Discourse
        </button>
      </div>*/}
    </>
  );
}

export default Home;
