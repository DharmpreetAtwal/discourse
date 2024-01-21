import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const Chat = ({ group }) => {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const chatMsgRef = collection(db, "chat-messages");

  useEffect(() => {
    const queryMsg = query(chatMsgRef, where("group", "==", group));
    onSnapshot(queryMsg, (snapshot) => {
      let arr = [];
      snapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });
      setMsgs(arr);
    });
  }, []);

  const handleBtnSubmit = async (e) => {
    e.preventDefault();
    if (msg !== "") {
      await addDoc(chatMsgRef, {
        msg: msg,
        created: serverTimestamp(),
        uid: auth.currentUser.uid,
        user: auth.currentUser.displayName,
        group: group,
      });
    }

    setMsg("");
  };

  return (
    <div>
      <form onSubmit={handleBtnSubmit}>
        <input
          className="bg-red-500"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Message"
        />
        <button className="bg-orange-500" type="submit">
          Submit
        </button>
      </form>

      <div>
        {msgs.map((message) => (
          <div key={message.created} className="w-full">
            <p>
              {message.user}:{message.msg}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
