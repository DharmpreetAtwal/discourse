import { query } from "firebase/database";
import { collection, doc, getDoc, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

export const useGetPublicGroups = (userID) => {
  const [publicGroups, setPublicGroups] = useState([]);

  useEffect(() => {
    (async () => {
      const queryPublicGroup = query(
        collection(db, "groups"),
        where("isPrivate", "==", false),
        where("members", "array-contains", userID)
      );

      let groupList = [];
      const qSnapshot = await getDocs(queryPublicGroup);
      qSnapshot.forEach((group) => {
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

          const latestMessageSnapshot = await getDoc(latestMessageDoc);
          group.latestMessage = latestMessageSnapshot;
          setPublicGroups(groupList);
        }
      });
    })();
  }, []);

  return { publicGroups };
};
