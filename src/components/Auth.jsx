import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db, providerGoogleAuth, rtDB } from "../config/firebase";
import { getDatabase, onDisconnect, ref, set } from "firebase/database";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useSetIsOnline } from "../hooks/useSetIsOnline";

const cookies = new Cookies();

export const Auth = ({ setIsAuth, setUserID }) => {
  const navigate = useNavigate();
  const { setIsOnline, userIsOnlineRef } = useSetIsOnline();

  const signInGoogle = async () => {
    try {
      const info = await signInWithPopup(auth, providerGoogleAuth);

      //cookies.set("token-auth", info.user.refreshToken);
      //cookies.set("uid", info.user.uid);

      setIsAuth(true);
      setUserID(info.user.uid);

      const docRef = doc(db, "users", info.user.uid);
      const docSnap = await getDoc(docRef);

      /* 
        Two cases needed, one where user already exists and they need 
        a new attribute added, or the user is new, all attributes are 
        created fresh. 

        A seperate useEffect exists in App.jsx to add an attribute to all 
        docs in user collection 
      */
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          pendingFriends: arrayUnion(),
        });
      } else {
        await setDoc(docRef, {
          email: info.user.email,
          pendingFriends: [],
          friends: [],
        });
      }

      setIsOnline(docRef.id, true);

      const userIsOnlineRef = ref(rtDB, docRef.id + "/isOnline");
      onDisconnect(userIsOnlineRef).set(false);
    } catch (err) {
      console.error(err);
    }

    navigate("/home");
  };

  return (
    <div>
      <button className="bg-purple-500" onClick={signInGoogle}>
        {" "}
        Sign in Google{" "}
      </button>
    </div>
  );
};
