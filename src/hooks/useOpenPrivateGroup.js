import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";

export const useOpenPrivateGroup = () => {
  const groupCollection = collection(db, "groups");
  const navigate = useNavigate();

  const openPrivateGroup = async (userID, friendID, privateGroups) => {
    if (privateGroups[friendID] == null) {
      await addDoc(groupCollection, {
        creatorID: userID,
        members: [userID, friendID],
        isPrivate: true,
      }).then((doc) => {
        navigate("../privateGroup/" + doc.id + "/" + friendID, {
          replace: true,
        });
      });
    } else {
      navigate("../privateGroup/" + privateGroups[friendID] + "/" + friendID, {
        replace: true,
      });
    }
  };

  return { openPrivateGroup };
};
