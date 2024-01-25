import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const useGetGroup = (userID, groupID) => {
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  const groupDoc = doc(db, "groups", groupID);
  const groupMessagesCollection = collection(
    db,
    "groups/" + groupID + "/" + "groupMessages"
  );

  useEffect(() => {
    const unsubscribe1 = onSnapshot(groupDoc, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(groupDoc, {
          creatorID: userID,
          members: [userID],
        });
        setMembers([userID]);
      } else {
        setMembers(snapshot.data().members);
      }
    });

    const unsubscribe2 = onSnapshot(groupMessagesCollection, (snapshot) => {
      let array = [];
      snapshot.forEach((doc) => {
        if (doc.data().createdAt !== null) {
          array.push(doc.data());
        }
      });

      setMessages(array);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return { members, messages };
};
