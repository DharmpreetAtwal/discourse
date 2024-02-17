import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const useGetGroup = (userID, friendID, groupID, isPrivate) => {
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  const groupDoc = doc(db, "groups", groupID);
  const groupMessagesCollection = collection(
    db,
    "groups/" + groupID + "/" + "groupMessages"
  );

  useEffect(() => {
    let membersArray = [];
    if (isPrivate && friendID !== null) {
      membersArray = [userID, friendID];
    } else {
      membersArray = [userID];
    }

    const unsubscribe1 = onSnapshot(groupDoc, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(groupDoc, {
          creatorID: userID,
          members: membersArray,
          isPrivate: isPrivate,
        });
        setMembers(membersArray);
      } else {
        await updateDoc(groupDoc, {
          isPrivate: isPrivate,
        });
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