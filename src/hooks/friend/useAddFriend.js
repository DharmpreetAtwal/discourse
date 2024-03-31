import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const useAddFriend = () => {
  const addFriend = async (userID, friend) => {
    const userDocRef = doc(db, "users", userID);
    const friendDocRef = doc(db, "users", friend);

    await updateDoc(userDocRef, {
      friends: arrayUnion(friend),
      pendingFriends: arrayRemove(friend),
    });

    await updateDoc(friendDocRef, {
      friends: arrayUnion(userID),
    });
  };

  return { addFriend };
};
