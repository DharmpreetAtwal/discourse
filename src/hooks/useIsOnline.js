import { child, get, ref } from "firebase/database";
import { rtDB } from "../config/firebase";

const useIsOnline = () => {
  const isOnline = async (id) => {
    let online = false;

    await get(child(ref(rtDB), `${id}/isOnline`)).then((snapshot) => {
      if (snapshot.exists()) {
        online = snapshot.val();
      }
    });

    return online;
  };

  return { isOnline };
};

export default useIsOnline;
