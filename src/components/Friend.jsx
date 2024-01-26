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

function Friend({ userID }) {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [privateGroups, setPrivateGroups] = useState({});

  const sendFriendRequestInputRef = useRef(null);
  const usersCollectionRef = collection(db, "users");

  const navigate = useNavigate();

  const groupCollection = collection(db, "groups");

  // useGetUserInfo, takes userID, returns friends, pendingFriends
  // Hook contains no states
  const getUserInfo = async () => {
    const userDoc = doc(db, "users", userID);
    const snapshot = await getDoc(userDoc);
    if (snapshot.exists()) {
      setFriends(snapshot.data().friends);
      setPendingFriends(snapshot.data().pendingFriends);
    }
  };

  // useGetUserInfo hook called here, state assigned here
  useEffect(() => {
    getUserInfo();
    getPrivateGroups();
  }, []);

  const sendFriendRequest = async (email) => {
    const queryFriend = query(
      usersCollectionRef,
      where("email", "==", email),
      limit(1)
    );

    // Will always iterate only once
    const qSnapshot = await getDocs(queryFriend);
    qSnapshot.forEach(async (friend) => {
      const friendDocRef = doc(db, "users", friend.id);

      await updateDoc(friendDocRef, {
        pendingFriends: arrayUnion(userID),
      });
    });
  };

  const addFriend = async (friend) => {
    const userDocRef = doc(db, "users", userID);
    const friendDocRef = doc(db, "users", friend);

    await updateDoc(userDocRef, {
      friends: arrayUnion(friend),
      pendingFriends: arrayRemove(friend),
    });

    await updateDoc(friendDocRef, {
      friends: arrayUnion(userID),
    });

    setFriends([...friends, friend]);
    setPendingFriends(
      pendingFriends.filter(function (item) {
        item != friend;
      })
    );
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
            sendFriendRequest(sendFriendRequestInputRef.current.value)
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
                onClick={() => addFriend(friend)}
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
