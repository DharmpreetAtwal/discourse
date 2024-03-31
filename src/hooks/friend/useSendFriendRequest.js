import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export const useSendFriendRequest = () => {
  const usersCollectionRef = collection(db, "users");

  const sendFriendRequest = async (to, from) => {
    const queryFriend = query(
      usersCollectionRef,
      where("email", "==", to),
      limit(1)
    );

    const qSnapshot = await getDocs(queryFriend);
    const friendDocRef = qSnapshot.docs[0].ref;
    await updateDoc(friendDocRef, {
      pendingFriends: arrayUnion(from),
    });
  };

  return { sendFriendRequest };
};
