import { query } from "firebase/database";
import { collection, doc, getDoc, getDocs, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../config/firebase";

export const useGetPublicGroups = (userID) => {
  const [publicGroups, setPublicGroups] = useState([]);

  useEffect(() => {
    (async () => {
      console.log("useGetPublicGroup");
      const queryPublicGroup = query(
        collection(db, "groups"),
        where("isPrivate", "==", false),
        where("members", "array-contains", userID)
      );

      var groupList = [];
      var promiseList = [];
      const qPromise = getDocs(queryPublicGroup);
      qPromise.then((qSnapshot) => {
        promiseList = qSnapshot.docs.map((group) => {
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

            return getDoc(latestMessageDoc);
          }
        });

        Promise.all(promiseList).then((results) => {
          results.forEach((latestMessage, index) => {
            groupList[index].latestMessage = latestMessage;
          });

          setPublicGroups(groupList);
        });
      });
    })();
  }, []);

  return { publicGroups };
};
