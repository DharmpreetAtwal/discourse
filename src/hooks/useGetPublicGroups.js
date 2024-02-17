import { query } from "firebase/database";
import { collection, getDocs, where } from "firebase/firestore";
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
        groupList.push([group.id, group.data()]);
      });

      setPublicGroups(groupList);
    })();
  }, []);

  return { publicGroups };
};
