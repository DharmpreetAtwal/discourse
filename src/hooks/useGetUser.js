import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";

export const useGetUser = (userID) => {
  const [friends, setFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);

  useEffect(() => {
    const userDoc = doc(db, "users", userID);
    const unsubscribe1 = onSnapshot(userDoc, async (snapshot) => {
      if (snapshot.exists()) {
        setFriends(snapshot.data().friends);
        setPendingFriends(snapshot.data().pendingFriends);
      }
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  return { friends, pendingFriends };
};
