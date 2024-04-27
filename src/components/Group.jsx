import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGroup } from "../hooks/group/useGetGroup";
import { useAddMember } from "../hooks/group/useAddMember";
import { useSendMessage } from "../hooks/group/useSendMessage";
import { useSetOpenGroup } from "../hooks/useSetOpenGroup";
import useSetGroupLastOpenByUser from "../hooks/useSetGroupLastOpenByUser";
import useGetOpenGroup from "../hooks/useGetOpenGroup";

function Group({ userID, isPrivate }) {
  const userMessageInputRef = useRef("");
  const addMemberInputRef = useRef("");
  const { groupID } = useParams();

  const { members, messages } = useGetGroup(userID, groupID);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const { sendMessage } = useSendMessage();
  const { addMember } = useAddMember();
  const navigate = useNavigate();
  const { setOpenGroup } = useSetOpenGroup();
  const { setGroupLastOpenByUser } = useSetGroupLastOpenByUser();
  const { getOpenGroup } = useGetOpenGroup();

  const handleBtnHome = () => {
    setOpenGroup(userID, "");
    navigate("/home");
  };

  const handleBtnSubmit = async (e) => {
    e.preventDefault();
    sendMessage(userID, groupID, userMessageInputRef.current.value);
    updateOpenGroupMembers();
    userMessageInputRef.current.value = "";
  };

  const updateOpenGroupMembers = () => {
    members.forEach(async (member) => {
      let group = await getOpenGroup(member);

      // Only update lastOpened for person who is not sending message
      // Excludes case that is handled in sendMessage
      if (member !== userID && group === groupID) {
        setGroupLastOpenByUser(member, groupID);
      }
    });
  };

  const handleBtnAddMember = () => {
    addMember(addMemberInputRef.current.value, groupID);
    addMemberInputRef.current.value = "";
  };

  const handleBtnOpenSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col w-full">
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
            <button
              onClick={handleBtnOpenSidebar}
              id="sidebarToggle"
              type="button"
              className="bg-purple-500"
            >
              Open Sidebar
            </button>
          </div>
        </div>
        {members.includes(userID) ? (
          <div className="flex flex-row bg-slate-600 relative h-[90vh] w-full">
            <div
              className={
                "bg-slate-500 pb-16 overflow-auto no-scrollbar " +
                (isSidebarVisible ? "w-4/5" : "w-full")
              }
            >
              {messages.length > 0 &&
                messages
                  .sort((a, b) => a.createdAt.toDate() - b.createdAt.toDate())
                  .map((msg) => (
                    <div
                      key={msg.createdAt}
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

            {isSidebarVisible && (
              <div
                id="sidebar"
                className="bg-yellow-200 w-1/5 transition-all duration-500"
              >
                <div>
                  <p> Current Members: </p>
                  {members.map((member) => {
                    return (
                      <p key={member} className="bg-emerald-500">
                        {member}
                      </p>
                    );
                  })}
                </div>

                <div className="my-auto">
                  {!isPrivate && (
                    <div>
                      <input
                        className="bg-green-500 text-gray-900"
                        ref={addMemberInputRef}
                        placeholder="Add a Member"
                      />
                      <button
                        className="bg-purple-500"
                        onClick={handleBtnAddMember}
                      >
                        Add Member
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="fixed bottom-0 p-2 w-full">
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
