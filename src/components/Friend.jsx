import { useSendFriendRequest } from "../hooks/friend/useSendFriendRequest";
import { useOpenPrivateGroup } from "../hooks/useOpenPrivateGroup";
import { useGetOnlineFriends } from "../hooks/useGetOnlineFriends";
import { useAddFriend } from "../hooks/friend/useAddFriend";
import { useCreateGroup } from "../hooks/useCreateGroup";
import { useGetUserFriends } from "../hooks/useGetUserFriends";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function Friend({ userID }) {
  const { friends, pendingFriends, privateGroups } = useGetUserFriends(userID);
  const { onlineFriends } = useGetOnlineFriends(friends);
  const { sendFriendRequest } = useSendFriendRequest();
  const { createGroup } = useCreateGroup();
  const { addFriend } = useAddFriend();
  const navigate = useNavigate();

  const sendFriendRequestInputRef = useRef(null);

  const handleAddFriendButton = async (friend) => {
    await addFriend(userID, friend);
  };

  const handleOpenPrivateGroupBtn = (friendID) => {
    if (privateGroups[friendID] == null) {
      createGroup(userID, [friendID], true).then((doc) => {
        navigate("../privateGroup/" + doc.id + "/" + friendID, {
          replace: true,
        });
      });
    } else {
      navigate("../privateGroup/" + privateGroups[friendID] + "/" + friendID, {
        replace: true,
      });
    }
  };

  return (
    <div>
      <div className="mb-2">
        {friends.map((friend, index) => {
          return (
            <div
              className="w-full flex flex-row h-16 mb-1 p-2 bg-slate-100 justify-between items-center"
              key={friend.uid}
            >
              <div className="flex flex-row h-full">
                <img
                  className="h-full rounded-full mr-2"
                  src={friend.photoURL}
                />{" "}
                <div className="flex flex-col">
                  {friend.displayName}
                  <h1
                    className={
                      onlineFriends[index]
                        ? "text-emerald-500 font-bold"
                        : "text-red-500 italic"
                    }
                  >
                    {" "}
                    {onlineFriends[index] ? "Online" : "Offline"}{" "}
                  </h1>
                </div>
              </div>

              {privateGroups[friend.uid] == null ? (
                <button
                  onClick={() => handleOpenPrivateGroupBtn(friend.uid)}
                  className={
                    "w-1/5 h-3/4 text-xl rounded-lg m-1 shadow-md " +
                    (onlineFriends[index] ? "bg-blue-500" : "bg-slate-500")
                  }
                >
                  Chat
                </button>
              ) : (
                <button
                  onClick={() => handleOpenPrivateGroupBtn(friend.uid)}
                  className={
                    "w-1/6 h-12 text-xl " +
                    (onlineFriends[index] ? "bg-green-500" : "bg-slate-500")
                  }
                >
                  {onlineFriends[index] ? "Online!" : "offline"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mb-2">
        <h2 className="bg-purple-400 text-2xl text-pink-500 text-center">
          Add a Friend
        </h2>
        <input ref={sendFriendRequestInputRef} className="bg-pink-500 w-5/6" />
        <button
          className="bg-green-500 w-1/6"
          onClick={() =>
            sendFriendRequest(sendFriendRequestInputRef.current.value, userID)
          }
        >
          Add
        </button>
      </div>
      <div className="mb-2">
        <h1 className="bg-purple-500">Pending Friends</h1>
        {pendingFriends.map((friend) => {
          return (
            <div className="flex flex-row w-full h-12 mb-1" key={friend.uid}>
              <img className="h-full" src={friend.photoURL} />

              <h1 className="flex bg-blue-500 text-3xl   w-full h-full items-center justify-center">
                {friend.displayName}
              </h1>

              <button
                onClick={() => handleAddFriendButton(friend.uid)}
                className="w-1/6 h-full bg-orange-500"
              >
                Add Friend
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Friend;
