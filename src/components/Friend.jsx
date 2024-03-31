import { useSendFriendRequest } from "../hooks/friend/useSendFriendRequest";
import { useOpenPrivateGroup } from "../hooks/useOpenPrivateGroup";
import { useGetPrivateGroups } from "../hooks/useGetPrivateGroups";
import { useGetOnlineFriends } from "../hooks/useGetOnlineFriends";
import { useAddFriend } from "../hooks/friend/useAddFriend";
import { useCreateGroup } from "../hooks/useCreateGroup";
import { useGetUser } from "../hooks/useGetUser";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function Friend({ userID }) {
  const { friends, pendingFriends } = useGetUser(userID);
  const { onlineFriends } = useGetOnlineFriends(friends);
  const { privateGroups } = useGetPrivateGroups(userID);
  const { sendFriendRequest } = useSendFriendRequest();
  const { openPrivateGroup } = useOpenPrivateGroup();
  const { addFriend } = useAddFriend();
  const { createGroup } = useCreateGroup();
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
        <h1 className="bg-green-200 text-blue-500 text-3xl text-center">
          Friends:
        </h1>
        {friends.map((friendID, index) => {
          return (
            <div key={friendID}>
              <h1 className="bg-yellow-500">
                {privateGroups[friendID] == null ? (
                  <button
                    onClick={() => handleOpenPrivateGroupBtn(friendID)}
                    className="bg-blue-500"
                  >
                    {friendID}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPrivateGroupBtn(friendID)}
                    className={
                      onlineFriends[index] ? "bg-green-500" : "bg-slate-500"
                    }
                  >
                    {friendID}
                  </button>
                )}
              </h1>
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
            <div key={friend}>
              <h1 className="bg-blue-500">{friend}</h1>
              <button
                onClick={() => handleAddFriendButton(friend)}
                className="bg-orange-500"
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
