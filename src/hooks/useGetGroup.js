import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  serverTimestamp,
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
    console.log("useGetGroup");

    let membersArray = [];
    if (isPrivate && friendID !== null) {
      membersArray = [userID, friendID];
    } else {
      membersArray = [userID];
    }

    (async () => {
      const snapshot = await getDoc(groupDoc);
      //const lastOpenedByUserMap = snapshot.data().lastOpenedByUser;
      //lastOpenedByUserMap[userID] = serverTimestamp();

      if (!snapshot.exists()) {
        const lastOpenedByUserMap = {};
        lastOpenedByUserMap[userID] = serverTimestamp();

        await setDoc(groupDoc, {
          creatorID: userID,
          members: membersArray,
          isPrivate: isPrivate,
          lastOpenedByUser: lastOpenedByUserMap,
        });
        setMembers(membersArray);
      } else {
        const lastOpenedByUserMap = snapshot.data().lastOpenedByUser;
        lastOpenedByUserMap[userID] = serverTimestamp();

        await updateDoc(groupDoc, {
          isPrivate: isPrivate,
          lastOpenedByUser: lastOpenedByUserMap,
        });
        setMembers(snapshot.data().members);
      }
    })();

    //const unsubscribe1 = onSnapshot(groupDoc, async (snapshot) => {

    //});

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
      //unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return { members, messages };
};
