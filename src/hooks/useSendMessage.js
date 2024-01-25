import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const useSendMessage = () => {
  const sendMessage = async (userID, groupID, message) => {
    const groupMessagesCollection = collection(
      db,
      "groups/" + groupID + "/" + "groupMessages"
    );

    if (message !== "") {
      await addDoc(groupMessagesCollection, {
        createdAt: serverTimestamp(),
        sentBy: userID,
        message: message,
      });
    }
  };

  return { sendMessage };
};
