import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  addDoc,
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
    // let membersArray = [];
    // if (isPrivate && friendID !== null) {
    //   membersArray = [userID, friendID];
    // } else {
    //   membersArray = [userID];
    // }

    (async () => {
      /*
      if (!snapshot.exists()) {
        const lastOpenedByUserMap = {};
        lastOpenedByUserMap[userID] = serverTimestamp();

        await setDoc(groupDoc, {
          creatorID: userID,
          members: membersArray,
          isPrivate: isPrivate,
          lastOpenedByUser: lastOpenedByUserMap,
        });
      } else {*/
      const snapshot = await getDoc(groupDoc);
      const lastOpenedByUserMap = snapshot.data().lastOpenedByUser;
      if (lastOpenedByUserMap) {
        lastOpenedByUserMap[userID] = serverTimestamp();
      }

      await updateDoc(groupDoc, {
        //isPrivate: isPrivate,
        lastOpenedByUser: lastOpenedByUserMap,
      });
      //}
    })();

    const unsubscribe1 = onSnapshot(groupDoc, (snapshot) => {
      setMembers(snapshot.data().members);
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
