import { useEffect, useState } from "react";
import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Group from "./components/Group";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./config/firebase";

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("token-auth"));
  const [userID, setUserID] = useState(cookies.get("uid"));
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // A function that adds an attribute to all docs in user collection
  /*useEffect(() => {
    (async () => {
      const docSnapshot = await getDocs(collection(db, "users"));
      docSnapshot.forEach((docC) => {
        const docRef = doc(db, "users/" + docC.id);
        console.log(docRef);
        updateDoc(docRef, {
          isOnline: false,
        });
      });
    })();
  });*/

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Auth
                setIsAuth={setIsAuth}
                setUserID={setUserID}
                setDisplayName={setDisplayName}
                setPhotoURL={setPhotoURL}
              />
            }
          ></Route>
          <Route
            path="home"
            element={
              <Home
                userID={userID}
                setIsAuth={setIsAuth}
                displayName={displayName}
                photoURL={photoURL}
              />
            }
          ></Route>
          <Route
            path="group/:groupID"
            element={<Group userID={userID} isPrivate={false} />}
          />
          <Route
            path="privateGroup/:groupID/:friendID"
            element={<Group userID={userID} isPrivate={true} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
