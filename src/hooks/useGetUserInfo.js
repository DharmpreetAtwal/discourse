import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const useGetUserInfo = () => {
  const getUserInfo = async (userID) => {
    const userDoc = doc(db, "users", userID);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      let userInfo = {
        uid: userID,
        displayName: userSnapshot.data().displayName,
        photoURL: userSnapshot.data().photoURL,
      };

      return userInfo;
    }

    return {};
  };

  return { getUserInfo };
};

export default useGetUserInfo;
