import { auth, db, providerGoogleAuth } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth, setUserID }) => {
  const navigate = useNavigate();
  const signInGoogle = async () => {
    try {
      const info = await signInWithPopup(auth, providerGoogleAuth);

      cookies.set("token-auth", info.user.refreshToken);
      cookies.set("uid", info.user.uid);

      setIsAuth(true);
      setUserID(info.user.uid);

      const docRef = doc(db, "users", info.user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: info.user.email,
          pendingFriends: [],
          friends: [],
        });
      } else {
        await updateDoc(docRef, {
          pendingFriends: arrayUnion(),
        });
      }
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
