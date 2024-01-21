import { useState, useRef } from "react";
import { Auth } from "./components/Auth";
import "./App.css";
import Cookies from "universal-cookie";
import { Chat } from "./components/Chat";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("token-auth"));
  const [group, setGroup] = useState(null);
  const groupInputRef = useRef(null);

  if (!isAuth) {
    return (
      <>
        <h1 className="bg-red-500">WORKS</h1>
        <Auth setIsAuth={setIsAuth} />
      </>
    );
  }

  return (
    <div>
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
        </div>
      )}
    </div>
  );
}

export default App;
