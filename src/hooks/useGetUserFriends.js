import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import useGetUserInfo from "./useGetUserInfo";

export const useGetUserFriends = (userID) => {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);
  const [privateGroups, setPrivateGroups] = useState({});
  const { getUserInfo } = useGetUserInfo();

  useEffect(() => {
    const userDoc = doc(db, "users", userID);
    const unsubscribe1 = onSnapshot(userDoc, async (snapshot) => {
      if (snapshot.exists()) {
        let friendsArray = [];
        snapshot.data().friends.forEach((friend) => {
          friendsArray.push(getUserInfo(friend));
        });

        Promise.all(friendsArray).then((evaluated) => {
          setFriends(evaluated);
        });

        let pendingFriendsArray = [];
        snapshot.data().pendingFriends.forEach((friend) => {
          pendingFriendsArray.push(getUserInfo(friend));
        });

        Promise.all(pendingFriendsArray).then((evaluated) => {
          setPendingFriends(evaluated);
        });

        let groupArray = [];
        snapshot.data().privateGroups.forEach((group) => {
          const groupRef = doc(db, "groups", group);
          groupArray.push(getDoc(groupRef));
        });

        let groupMap = {};
        Promise.all(groupArray).then((evaluated) => {
          evaluated.forEach((group) => {
            let friendID = group
              .data()
              .members.filter((item) => item != userID)
              .at(0);
            groupMap = { ...groupMap, [friendID]: group.id };
          });

          setPrivateGroups(groupMap);
        });
      }
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  return { friends, pendingFriends, privateGroups };
};
