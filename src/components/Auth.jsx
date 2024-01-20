import { auth, providerGoogleAuth } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

export const Auth = () => {
  const signInGoogle = async () => {
    const userInfo = await signInWithPopup(auth, providerGoogleAuth);
    console.log(userInfo);
  };

  return (
    <div>
      <button onClick={signInGoogle}> WORKING </button>
    </div>
  );
};
