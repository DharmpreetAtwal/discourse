import {
  doc,
  addDoc,
  collection,
  getDoc,
  onSnapshot,
  setDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { db } from "../config/firebase";

function Group({ userID }) {
  const userMessageInputRef = useRef(null);
  const membersRef = useRef([]);
  const addMemberInputRef = useRef(null);

  const [groupMessages, setGroupMessages] = useState([]);
  const { groupID } = useParams();

  const groupMessagesCollection = collection(
    db,
    "groups/" + groupID + "/" + "groupMessages"
  );
  const groupRef = doc(db, "groups", groupID);

  const sendMessage = async (msg) => {
    if (msg !== "") {
      await addDoc(groupMessagesCollection, {
        createdAt: serverTimestamp(),
        sentBy: userID,
        message: msg,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) {
        await setDoc(groupRef, {
          creatorID: userID,
          members: [userID],
        });

        membersRef.current = [userID];
      } else {
        membersRef.current = groupSnap.data().members;
      }

      onSnapshot(groupMessagesCollection, (snapshot) => {
        let array = [];

        snapshot.forEach((doc) => {
          if (doc.data().createdAt !== null) {
            array.push(doc.data());
          }
        });

        setGroupMessages(array);
      });
    })();
  }, []);

  const addMember = async () => {
    const userQuery = query(
      collection(db, "users"),
      where("email", "==", addMemberInputRef.current.value)
    );

    const docsSnapshot = await getDocs(userQuery);
    if (docsSnapshot.size > 0) {
      await updateDoc(groupRef, {
        members: arrayUnion(docsSnapshot.docs[0].id),
      });
    }
  };

  const handleBtnSubmit = async (e) => {
    e.preventDefault();
    sendMessage(userMessageInputRef.current.value);
  };

  return (
    <>
      {membersRef.current.includes(userID) ? (
        <div>
          <h1 className="bg-pink-500">{groupID}</h1>
          <form onSubmit={handleBtnSubmit}>
            <input
              className="bg-red-500"
              ref={userMessageInputRef}
              placeholder="Message"
            />
            <button className="bg-orange-500" type="submit">
              Submit
            </button>

            <input
              className="bg-green-500"
              ref={addMemberInputRef}
              placeholder="Add a Member"
            />
            <button onClick={addMember}>Add Member</button>
          </form>

          <div>
            {groupMessages.length > 0 &&
              groupMessages
                .sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate())
                .map((msg) => (
                  <div
                    key={msg.createdAt.toDate().toString()}
                    className="w-full"
                  >
                    <p>{msg.message}</p>
                    <p> {msg.createdAt.toDate().toString()} </p>
                    <p> {msg.sentBy} </p>
                  </div>
                ))}
          </div>
        </div>
      ) : (
        <div>
          <h1> You are not a member of this group </h1>
        </div>
      )}
    </>
  );
}

export default Group;
