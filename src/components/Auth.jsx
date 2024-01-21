import { auth, providerGoogleAuth } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const signInGoogle = async () => {
    try {
      const info = await signInWithPopup(auth, providerGoogleAuth);
      cookies.set("token-auth", info.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.err(err);
    }
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
