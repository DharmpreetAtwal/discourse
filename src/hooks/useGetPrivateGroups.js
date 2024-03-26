import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

export const useGetPrivateGroups = (userID) => {
  const [privateGroups, setPrivateGroups] = useState({});

  useEffect(() => {
    (async () => {
      //console.log("useGetPrivateGroup");
      const queryPrivateGroup = query(
        collection(db, "groups"),
        where("isPrivate", "==", true),
        where("members", "array-contains", userID)
      );

      let groupMap = {};
      const qSnapshot = await getDocs(queryPrivateGroup);
      qSnapshot.forEach((group) => {
        let friendID = group
          .data()
          .members.filter((item) => item != userID)
          .at(0);
        groupMap = { ...groupMap, [friendID]: group.id };
      });

      setPrivateGroups(groupMap);
    })();
  }, []);

  return { privateGroups };
};
