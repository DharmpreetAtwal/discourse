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
import { db } from "../../config/firebase";

export const useGetGroup = (userID, groupID) => {
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);

  const groupDoc = doc(db, "groups", groupID);
  const groupMessagesCollection = collection(
    db,
    "groups/" + groupID + "/" + "groupMessages"
  );

  useEffect(() => {
    const unsubscribe1 = onSnapshot(groupDoc, (snapshot) => {
      setMembers(snapshot.data().members);

      if (snapshot.data().members.includes(userID)) {
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
      } else {
        return () => {
          unsubscribe1();
        };
      }
    });
  }, []);

  return { members, messages };
};
