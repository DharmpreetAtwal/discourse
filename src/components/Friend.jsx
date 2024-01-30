import { useSendFriendRequest } from "../hooks/useSendFriendRequest";
import { useGetPrivateGroups } from "../hooks/useGetPrivateGroups";
import { useOpenPrivateGroup } from "../hooks/useOpenPrivateGroup";
import { useAddFriend } from "../hooks/useAddFriend";
import { useGetUser } from "../hooks/useGetUser";
import { useRef } from "react";

function Friend({ userID }) {
  const { friends, pendingFriends } = useGetUser(userID);
  const { privateGroups } = useGetPrivateGroups(userID);
  const { sendFriendRequest } = useSendFriendRequest();
  const { openPrivateGroup } = useOpenPrivateGroup();
  const { addFriend } = useAddFriend();

  const sendFriendRequestInputRef = useRef(null);

  const handleAddFriendButton = async (friend) => {
    await addFriend(userID, friend);
  };

  return (
    <div>
      <div>
        <h2>Add a Friend</h2>
        <input ref={sendFriendRequestInputRef} className="bg-pink-500" />
        <button
          onClick={() =>
            sendFriendRequest(sendFriendRequestInputRef.current.value, userID)
          }
        >
          Add
        </button>
      </div>
      <div>
        <h1>Friends: </h1>
        {friends.map((friendID) => {
          return (
            <div key={friendID}>
              <h1 className="bg-yellow-500">
                {friendID}
                {privateGroups[friendID] == null ? (
                  <button
                    onClick={() =>
                      openPrivateGroup(userID, friendID, privateGroups)
                    }
                    className="bg-blue-500"
                  >
                    Create Private Group
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      openPrivateGroup(userID, friendID, privateGroups)
                    }
                    className="bg-green-500"
                  >
                    Open Private Group
                  </button>
                )}
              </h1>
            </div>
          );
        })}
      </div>
      <div>
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
