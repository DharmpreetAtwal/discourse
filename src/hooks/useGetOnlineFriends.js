import { onValue, ref } from "firebase/database";
import { rtDB } from "../config/firebase";
import { useEffect, useState } from "react";
import { useGetUser } from "./useGetUser";

export const useGetOnlineFriends = (friends) => {
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    if (friends.length > 0) {
      //let onlineFriendsList = [];

      friends.forEach((friendID) => {
        const isOnlineRef = ref(rtDB, friendID + "/isOnline");
        onValue(isOnlineRef, (snapshot) => {
          const data = snapshot.val();
          setOnlineFriends([...onlineFriends, data]);

          //onlineFriendsList.push(data);
        });
      });
    }
  }, [friends]);

  return { onlineFriends };
};
