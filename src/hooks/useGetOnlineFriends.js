import { onValue, ref } from "firebase/database";
import { rtDB } from "../config/firebase";
import { useEffect, useState } from "react";

export const useGetOnlineFriends = (friends) => {
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    if (friends.length > 0) {
      friends.forEach((friend) => {
        const isOnlineRef = ref(rtDB, friend.uid + "/isOnline");
        onValue(isOnlineRef, (snapshot) => {
          const data = snapshot.val();
          setOnlineFriends([...onlineFriends, data]);
        });
      });
    }
  }, [friends]);

  return { onlineFriends };
};
