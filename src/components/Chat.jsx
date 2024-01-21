import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";

export const Chat = ({ group }) => {
  const [msg, setMsg] = useState("");
  const chatMsgRef = collection(db, "chat-messages");

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
    </div>
  );
};
