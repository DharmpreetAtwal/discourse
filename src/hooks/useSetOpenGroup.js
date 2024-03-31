import { ref, set } from "firebase/database";
import { rtDB } from "../config/firebase";

export const useSetOpenGroup = () => {
  const setOpenGroup = (userID, groupID) => {
    const userOpenGroupRef = ref(rtDB, userID + "/openGroup");
    set(userOpenGroupRef, groupID);
  };

  return { setOpenGroup };
};
