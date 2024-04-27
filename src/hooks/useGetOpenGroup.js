import { child, get, ref } from "firebase/database";
import { rtDB } from "../config/firebase";

const useGetOpenGroup = () => {
  const getOpenGroup = async (id) => {
    let openGroup = "";

    await get(child(ref(rtDB), `${id}/openGroup`)).then((snapshot) => {
      if (snapshot.exists()) {
        openGroup = snapshot.val();
      }
    });

    return openGroup;
  };

  return { getOpenGroup };
};

export default useGetOpenGroup;
