import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "../hooks/useGetUser";
import { useSendFriendRequest } from "../hooks/useSendFriendRequest";
import { useAddFriend } from "../hooks/useAddFriend";

function Friend({ userID }) {
  const [privateGroups, setPrivateGroups] = useState({});
  const { friends, pendingFriends } = useGetUser(userID);

  const { sendFriendRequest } = useSendFriendRequest();
  const { addFriend } = useAddFriend();
  const navigate = useNavigate();

  const groupCollection = collection(db, "groups");
  const sendFriendRequestInputRef = useRef(null);

  // useGetUserInfo hook called here, state assigned here
  useEffect(() => {
    getPrivateGroups();
  }, []);

  const handleAddFriendButton = async (friend) => {
    await addFriend(userID, friend);
  };

  const getPrivateGroups = async () => {
    const queryPrivateGroup = query(
      collection(db, "groups"),
      where("isPrivate", "==", true),
      where("members", "array-contains", userID)
    );

    let groupMap = {};
    const qSnapshot = await getDocs(queryPrivateGroup);
    qSnapshot.forEach((group) => {
      let friendID = group
        .data()
        .members.filter((item) => item != userID)
        .at(0);
      groupMap = { ...groupMap, [friendID]: group.id };
    });

    setPrivateGroups(groupMap);
  };

  const openPrivateGroup = async (friendID) => {
    if (privateGroups[friendID] == null) {
      await addDoc(groupCollection, {
        creatorID: userID,
        members: [userID, friendID],
        isPrivate: true,
      }).then((doc) => {
        setPrivateGroups((prev) => ({ ...prev, [friendID]: doc.id }));
        navigate("../privateGroup/" + doc.id + "/" + friendID, {
          replace: true,
        });
      });
    } else {
      navigate("../privateGroup/" + privateGroups[friendID] + "/" + friendID, {
        replace: true,
      });
    }
  };

  return (
    <div>
      <div>
        <h2>Add a Friend</h2>
        <input ref={sendFriendRequestInputRef} className="bg-pink-500" />
        <button
          onClick={() =>
            sendFriendRequest(sendFriendRequestInputRef.current.value, userID)
          }
        >
          Add
        </button>
      </div>
      <div>
        <h1>Friends: </h1>
        {friends.map((friendID) => {
          return (
            <div key={friendID}>
              <h1 className="bg-yellow-500">
                {friendID}

                {privateGroups[friendID] == null ? (
                  <button
                    onClick={() => openPrivateGroup(friendID)}
                    className="bg-blue-500"
                  >
                    Create Private Group
                  </button>
                ) : (
                  <button
                    onClick={() => openPrivateGroup(friendID)}
                    className="bg-green-500"
                  >
                    {" "}
                    Open Private Group
                  </button>
                )}
              </h1>
            </div>
          );
        })}
      </div>
      <div>
        <h1 className="bg-purple-500">Pending Friends</h1>
        {pendingFriends.map((friend) => {
          return (
            <div key={friend}>
              <h1 className="bg-blue-500">{friend}</h1>
              <button
                onClick={() => handleAddFriendButton(friend)}
                className="bg-orange-500"
              >
                Add Friend
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Friend;
