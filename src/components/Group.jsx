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

  const isUserMember = () => {
    let isMember = false;

    members.forEach((member) => {
      if (member.uid === userID) {
        isMember = true;
      }
    });

    return isMember;
  };

  const getMember = (userID) => {
    let member = {};

    members.forEach((mem) => {
      if (mem.uid === userID) {
        member = mem;
      }
    });

    return member;
  };

  // Avoid using setGroupLastOpenByUser() on Home Btn click, causes issues
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
      let group = await getOpenGroup(member.uid);

      // Only update lastOpened for person who is not sending message
      // Excludes case that is handled in sendMessage
      if (member.uid !== userID && group === groupID) {
        setGroupLastOpenByUser(member.uid, groupID);
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
        {isUserMember() ? (
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
                  .map((msg) => {
                    const sender = getMember(msg.sentBy);

                    return (
                      <div
                        key={msg.createdAt}
                        className="flex flex-row w-full h-14 bg-amber-500 mb-1 items-center justify-between "
                      >
                        <div className="flex flex-row h-5/6 items-center justify-center">
                          <img
                            className="h-full rounded-2xl m-1"
                            src={sender.photoURL}
                          />
                          <p> {sender.displayName} </p>
                        </div>

                        <div>
                          <p>{msg.message}</p>
                        </div>

                        <div>
                          <p> {msg.createdAt.toDate().toString()} </p>
                        </div>
                      </div>
                    );
                  })}
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
                      <div
                        className="flex flex-row w-full h-12 mb-2 justify-center items-center"
                        key={member.uid}
                      >
                        <div className="w-1/6 h-full rounded-full">
                          <img
                            className="rounded-full"
                            src={`${member.photoURL}`}
                          />
                        </div>

                        <div className="flex w-5/6 items-center justify-center bg-green-500 p-2 text-2xl">
                          {member.displayName}
                        </div>
                      </div>
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
