import { query } from "firebase/database";
import { collection, doc, getDoc, getDocs, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../config/firebase";

export const useGetPublicGroups = () => {
  const getPublicGroups = async (userID) => {
    console.log("useGetPublicGroup");
    const queryPublicGroup = query(
      collection(db, "groups"),
      where("isPrivate", "==", false),
      where("members", "array-contains", userID)
    );

    let groupList = [];
    var promiseList = [];
    const qSnapshot = await getDocs(queryPublicGroup);

    qSnapshot.forEach((group) => {
      if (group.data().latestMessage && group.id !== "undefined") {
        const latestMessageDoc = doc(
          db,
          "groups/" +
            group.id +
            "/groupMessages/" +
            group.data().latestMessage.id
        );

        const groupMap = {};
        groupMap.id = group.id;
        groupMap.data = group.data();
        groupList.push(groupMap);

        promiseList.push(getDoc(latestMessageDoc));
      }
    });

    const promises = await Promise.all(promiseList);
    promises.forEach((latestMessage, index) => {
      groupList[index].latestMessage = latestMessage;
    });

    return groupList;
  };

  return { getPublicGroups };
};
