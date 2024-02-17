import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const useSendMessage = () => {
  const sendMessage = async (userID, groupID, message) => {
    const groupMessagesCollection = collection(
      db,
      "groups/" + groupID + "/" + "groupMessages"
    );
    const groupDoc = doc(db, "groups/" + groupID);

    if (message !== "") {
      const docRef = await addDoc(groupMessagesCollection, {
        createdAt: serverTimestamp(),
        sentBy: userID,
        message: message,
      });

      await updateDoc(groupDoc, {
        latestMessage: docRef,
      });
    }
  };

  return { sendMessage };
};
