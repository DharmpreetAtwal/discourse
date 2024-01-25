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
          <Route path="group/:groupID" element={<Group userID={userID} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
