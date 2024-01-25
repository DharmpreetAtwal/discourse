import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetGroup } from "../hooks/useGetGroup";
import { useAddMember } from "../hooks/useAddMember";
import { useSendMessage } from "../hooks/useSendMessage";

function Group({ userID }) {
  const userMessageInputRef = useRef("");
  const addMemberInputRef = useRef("");
  const { groupID } = useParams();

  const { members, messages } = useGetGroup(userID, groupID);
  const { sendMessage } = useSendMessage();
  const { addMember } = useAddMember();

  const handleBtnSubmit = async (e) => {
    e.preventDefault();
    sendMessage(userID, groupID, userMessageInputRef.current.value);
    userMessageInputRef.current.value = "";
  };

  const handleBtnAddMember = () => {
    addMember(addMemberInputRef.current.value, groupID);
    addMemberInputRef.current.value = "";
  };

  return (
    <>
      {members.includes(userID) ? (
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
            <button onClick={handleBtnAddMember}>Add Member</button>
          </form>

          <div>
            {messages.length > 0 &&
              messages
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
