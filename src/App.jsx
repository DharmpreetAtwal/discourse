import { useState, useRef } from "react";
import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";
import Friend from "./components/Friend";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import "./App.css";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("token-auth"));
  const [userID, setUserID] = useState(cookies.get("uid"));

  const [group, setGroup] = useState(null);
  const groupInputRef = useRef(null);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setIsAuth(false);
        cookies.remove("uid", { path: "/" });
        console.log("SIGNED OUT");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!isAuth) {
    return (
      <>
        <h1 className="bg-red-500">WORKING? </h1>
        <Auth setIsAuth={setIsAuth} setUserID={setUserID} />
      </>
    );
  }

  return (
    <div>
      <button onClick={handleSignOut} className="bg-red-500">
        {" "}
        Sign Out{" "}
      </button>
      {group ? (
        <div>
          <Chat group={group} />
        </div>
      ) : (
        <div>
          <h2> Enter Your Group Name</h2>
          <input ref={groupInputRef} className="bg-orange-500" />
          <button
            onClick={() => setGroup(groupInputRef.current.value)}
            className="bg-red-500"
          >
            Enter Discourse
          </button>
          <Friend userID={userID} />
        </div>
      )}
    </div>
  );
}

export default App;
