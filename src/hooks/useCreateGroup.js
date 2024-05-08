import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const useCreateGroup = () => {
  const groupCollectionRef = collection(db, "groups");

  const createGroup = async (userID, friends, isPrivate) => {
    let membersArray = [...friends, userID];

    const lastOpenedByUserMap = {};
    lastOpenedByUserMap[userID] = serverTimestamp();

    const promise = await addDoc(groupCollectionRef, {
      creatorID: userID,
      members: membersArray,
      isPrivate: isPrivate,
      lastOpenedByUser: lastOpenedByUserMap,
    });

    if (isPrivate) {
      let promiseArray = [];
      membersArray.forEach(async (member) => {
        const memberRef = doc(db, "users/" + member);
        promiseArray.push(
          updateDoc(memberRef, {
            privateGroups: arrayUnion(`${promise.id}`),
          })
        );
      });

      Promise.all(promiseArray);
    }

    return promise;
  };

  return { createGroup };
};
