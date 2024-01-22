import { useState } from "react";
import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Group from "./components/Group";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("token-auth"));
  const [userID, setUserID] = useState(cookies.get("uid"));

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Auth setIsAuth={setIsAuth} setUserID={setUserID} />}
          ></Route>
          <Route
            path="home"
            element={<Home userID={userID} setIsAuth={setIsAuth} />}
          ></Route>
          <Route path="group/:groupID" element={<Group />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

{
  /*<div>
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
      </div>*/
}
