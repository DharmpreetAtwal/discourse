import { child, get, onValue, ref, set } from "firebase/database";
import { rtDB } from "../config/firebase";
import useSetGroupLastOpenByUser from "./useSetGroupLastOpenByUser";

export const useSetIsOnline = () => {
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();

  const setIsOnline = (userID, isOnline) => {
    const userIsOnlineRef = ref(rtDB, userID + "/isOnline");
    set(userIsOnlineRef, isOnline);

    if (!isOnline) {
      const userOpenGroupRef = ref(rtDB, userID + "/openGroup");
      onValue(
        userOpenGroupRef,
        (snapshot) => {
          if (snapshot.val() !== "") {
            setGroupLastOpenByUser(userID, snapshot.val());
            set(userOpenGroupRef, "");
          }
        },
        { onlyOnce: true }
      );
    }
  };

  return { setIsOnline };
};
