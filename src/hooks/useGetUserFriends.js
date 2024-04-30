import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import useGetUserInfo from "./useGetUserInfo";

export const useGetUserFriends = (userID) => {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const { getUserInfo } = useGetUserInfo();

  useEffect(() => {
    const userDoc = doc(db, "users", userID);
    const unsubscribe1 = onSnapshot(userDoc, async (snapshot) => {
      if (snapshot.exists()) {
        //setFriends(snapshot.data().friends);
        let friendsArray = [];
        snapshot.data().friends.forEach((friend) => {
          friendsArray.push(getUserInfo(friend));
        });

        Promise.all(friendsArray).then((evaluated) => {
          setFriends(evaluated);
        });

        setPendingFriends(snapshot.data().pendingFriends);
      }
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  return { friends, pendingFriends };
};
