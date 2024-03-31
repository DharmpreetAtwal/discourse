import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export const useAddMember = () => {
  const addMember = async (email, groupID) => {
    const groupDoc = doc(db, "groups", groupID);
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const docsSnapshot = await getDocs(userQuery);
    if (docsSnapshot.size > 0) {
      await updateDoc(groupDoc, {
        members: arrayUnion(docsSnapshot.docs[0].id),
      });
    }
  };

  return { addMember };
};
