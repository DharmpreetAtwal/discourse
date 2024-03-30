import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const useCreateGroup = () => {
  const groupCollectionRef = collection(db, "groups");

  const createGroup = async (userID, friends, isPrivate) => {
    let membersArray = [...friends, userID];

    const lastOpenedByUserMap = {};
    lastOpenedByUserMap[userID] = serverTimestamp();

    return await addDoc(groupCollectionRef, {
      creatorID: userID,
      members: membersArray,
      isPrivate: isPrivate,
      lastOpenedByUser: lastOpenedByUserMap,
    });
  };

  return { createGroup };
};
