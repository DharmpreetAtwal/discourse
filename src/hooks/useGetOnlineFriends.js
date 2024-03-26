import { onValue, ref } from "firebase/database";
import { rtDB } from "../config/firebase";
import { useEffect, useState } from "react";
import { useGetUser } from "./useGetUser";

export const useGetOnlineFriends = (userID) => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { friends } = useGetUser(userID);

  useEffect(() => {
    console.log("Getting online Friends");
    var onlineFriendsList = [];

    //console.log(friends);
    friends.forEach((friendID) => {
      const isOnlineRef = ref(rtDB, friendID + "/isOnline");
      onValue(isOnlineRef, (snapshot) => {
        const data = snapshot.val();
        onlineFriendsList.push(data);
      });
    });

    setOnlineFriends(onlineFriends);
  });

  return { onlineFriends };
};
