import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGroup } from "../hooks/useGetGroup";
import { useAddMember } from "../hooks/useAddMember";
import { useSendMessage } from "../hooks/useSendMessage";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

function Group({ userID, isPrivate }) {
  const userMessageInputRef = useRef("");
  const addMemberInputRef = useRef("");
  const { groupID, friendID } = useParams();

  const { members, messages } = useGetGroup(
    userID,
    friendID,
    groupID,
    isPrivate
  );
  const { sendMessage } = useSendMessage();
  const { addMember } = useAddMember();
  const navigate = useNavigate();

  const handleBtnHome = () => {
    navigate("/home");
  };

  const handleBtnSubmit = async (e) => {
    e.preventDefault();
    sendMessage(userID, groupID, userMessageInputRef.current.value);
    userMessageInputRef.current.value = "";
  };

  const handleBtnAddMember = () => {
    addMember(addMemberInputRef.current.value, groupID);
    addMemberInputRef.current.value = "";
  };

  useEffect(() => {
    (async () => {
      const docRef = doc(db, "groups/" + groupID);
      const updateMap = new Map();
      updateMap.set(`lastOpenedByUser.${userID}`, serverTimestamp());

      const updateObject = Object.fromEntries(updateMap);
      await updateDoc(docRef, updateObject);
    })();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row h-[10vh] bg-sky-500 justify-between">
          <div className="my-auto ml-1">
            <button className="bg-orange-500" onClick={handleBtnHome}>
              Home
            </button>
          </div>
          <div className="my-auto">
            <h1 className="bg-pink-500">{groupID}</h1>
          </div>
          <div className="my-auto">
            {!isPrivate && (
              <div>
                <input
                  className="bg-green-500"
                  ref={addMemberInputRef}
                  placeholder="Add a Member"
                />
                <button className="bg-purple-500" onClick={handleBtnAddMember}>
                  Add Member
                </button>
              </div>
            )}
          </div>
        </div>
        {members.includes(userID) ? (
          <div className="bg-slate-600 relative h-[90vh]">
            <div className="bg-slate-500">
              {messages.length > 0 &&
                messages
                  .sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate())
                  .map((msg) => (
                    <div
                      key={msg.createdAt.toDate().toString()}
                      className="flex flex-row justify-between w-full bg-amber-500 mb-1"
                    >
                      <div>
                        <p> {msg.sentBy} </p>
                      </div>

                      <div>
                        <p>{msg.message}</p>
                      </div>

                      <div>
                        <p> {msg.createdAt.toDate().toString()} </p>
                      </div>
                    </div>
                  ))}
            </div>

            <div className="fixed bottom-0 p-3 w-full">
              <form onSubmit={handleBtnSubmit}>
                <input
                  className="bg-red-500 w-11/12 p-1 text-4xl"
                  ref={userMessageInputRef}
                  placeholder="Message"
                />
                <button className="bg-orange-500 text-3xl w-1/12" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <h1> You are not a member of this group </h1>
          </div>
        )}
      </div>
    </>
  );
}

export default Group;
