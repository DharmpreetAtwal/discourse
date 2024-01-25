import {
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

function Friend({ userID }) {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);

  const sendFriendRequestInputRef = useRef(null);
  const usersCollectionRef = collection(db, "users");

  const getUserInfo = async () => {
    const userDoc = doc(db, "users", userID);
    const snapshot = await getDoc(userDoc);
    if (snapshot.exists()) {
      setFriends(snapshot.data().friends);
      setPendingFriends(snapshot.data().pendingFriends);
    }
  };

  useEffect(() => {
    getUserInfo();
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
        {friends.map((friend) => {
          return (
            <div key={friend}>
              <h1 className="bg-yellow-500"> {friend} </h1>
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
