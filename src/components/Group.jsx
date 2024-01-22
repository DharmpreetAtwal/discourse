import {
  doc,
  addDoc,
  collection,
  getDoc,
  onSnapshot,
  setDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { db } from "../config/firebase";

function Group() {
  const [userMessage, setUserMessage] = useState("");
  const [groupMessages, setGroupMessages] = useState([]);
  const groupsCollectionRef = collection(db, "groups");
  const { groupID } = useParams();

  useEffect(() => {
    (async () => {
      const groupRef = doc(db, "groups", groupID);
      const groupSnap = await getDoc(groupRef);
      const groupMessagesCollection = collection(
        db,
        "groups/" + groupID + "/" + "groupMessages"
      );

      if (groupSnap.exists()) {
        const groupMessagesSnapshot = await getDocs(groupMessagesCollection);
        groupMessagesSnapshot.forEach((doc) => {
          console.log(doc.data().message);
        });
      } else {
        await setDoc(groupRef, {
          creatorID: [],
        });

        await addDoc(groupMessagesCollection, {
          message: "WORKING",
        });
      }

      onSnapshot(groupMessagesCollection, (snapshot) => {
        let array = [];

        snapshot.forEach((doc) => {
          array.push(doc.data().message);
        });

        setGroupMessages(array);
      });
    })();
  }, []);

  const handleBtnSubmit = () => {};

  return (
    <div>
      <h1 className="bg-pink-500">{groupID}</h1>
      <form onSubmit={handleBtnSubmit}>
        <input
          className="bg-red-500"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Message"
        />
        <button className="bg-orange-500" type="submit">
          Submit
        </button>
      </form>

      <div>
        {groupMessages.map((msg) => (
          <div className="w-full">
            <p>{msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Group;
