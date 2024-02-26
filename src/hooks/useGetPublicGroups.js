import { query } from "firebase/database";
import { collection, doc, getDoc, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

export const useGetPublicGroups = (userID) => {
  const [publicGroups, setPublicGroups] = useState([]);

  useEffect(() => {
    (async () => {
      setPublicGroups([]);
      const queryPublicGroup = query(
        collection(db, "groups"),
        where("isPrivate", "==", false),
        where("members", "array-contains", userID)
      );

      let groupList = [];
      const qPromise = getDocs(queryPublicGroup);
      qPromise.then((qSnapshot) => {
        qSnapshot.forEach(async (group) => {
          const groupMap = {};
          //console.log(group.id);
          if (group.data().latestMessage && group.id !== "undefined") {
            const latestMessageDoc = doc(
              db,
              "groups/" +
                group.id +
                "/groupMessages/" +
                group.data().latestMessage.id
            );

            const latestMessagePromise = getDoc(latestMessageDoc);
            latestMessagePromise.then((snapshot) => {
              groupMap.latestMessage = snapshot;
              groupMap.id = group.id;
              groupMap.data = group.data();
              groupList.push(groupMap);
              setPublicGroups((prev) => {
                return [...prev, groupMap];
              });
            });
          }
        });

        //if (groupList.length > 0) {
        //  setPublicGroups(groupList);
        //}

        /*qSnapshot.forEach((group) => {
          if (group.id !== "undefined") {
            groupList.push({ id: group.id, data: group.data() });
          }
        });

        groupList.forEach(async (group) => {
          if (group.data.latestMessage) {
            const latestMessageDoc = doc(
              db,
              "groups/" +
                group.id +
                "/groupMessages/" +
                group.data.latestMessage.id
            );

            const latestMessagePromise = getDoc(latestMessageDoc);
            latestMessagePromise.then((snapshot) => {
              group.latestMessage = snapshot;
              console.log(group.latestMessage);
              setPublicGroups(groupList);
            });
          }
        });*/
      });
    })();
  }, []);

  return { publicGroups };
};
