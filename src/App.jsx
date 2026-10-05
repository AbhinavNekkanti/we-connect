import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { users } from "./data/users";
import { socket } from "./socket";
import "./App.css";

function getChatKey(user1, user2) {
  return [user1, user2].sort().join("-");
}

function App() {
  const [currentUser, setCurrentUser] = useState("ABHI");
  const [selectedUser, setSelectedUser] = useState(
    users.find((user) => user.name !== "ABHI")
  );
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const selectedMessages = useMemo(() => {
    if (!selectedUser) return [];
    return messages[getChatKey(currentUser, selectedUser.name)] || [];
  }, [messages, currentUser, selectedUser]);

  useEffect(() => {
    const handleMessage = (message) => {
      const key = getChatKey(message.sender, message.receiver);

      setMessages((previous) => ({
        ...previous,
        [key]: [...(previous[key] || []), message],
      }));
    };

    const handleHistory = (history) => {
      if (!selectedUser) return;

      const key = getChatKey(currentUser, selectedUser.name);

      setMessages((previous) => ({
        ...previous,
        [key]: history,
      }));
    };

    const handleOnlineUsers = (list) => {
      setOnlineUsers(list);
    };

    const handleTyping = ({ from }) => {
      setTypingUser(from);
      window.clearTimeout(window.__weConnectTypingTimer);
      window.__weConnectTypingTimer = window.setTimeout(() => {
        setTypingUser("");
      }, 1400);
    };

    const handleLike = (updatedMessage) => {
      const key = getChatKey(
        updatedMessage.sender,
        updatedMessage.receiver
      );

      setMessages((previous) => ({
        ...previous,
        [key]: (previous[key] || []).map((message) =>
          message.id === updatedMessage.id
            ? { ...message, likes: updatedMessage.likes }
            : message
        ),
      }));
    };

    socket.on("receive_private_message", handleMessage);
    socket.on("conversation_history", handleHistory);
    socket.on("online_users", handleOnlineUsers);
    socket.on("typing", handleTyping);
    socket.on("message_liked", handleLike);

    const join = () => {
      socket.emit("join", currentUser);

      if (selectedUser) {
        socket.emit("get_conversation", {
          withUser: selectedUser.name,
        });
      }
    };

    // Register the connect listener BEFORE connecting.
    // This prevents the first connection from missing the join event.
    socket.on("connect", join);

    if (!socket.connected) {
      socket.connect();
    } else {
      join();
    }

    return () => {
      socket.off("receive_private_message", handleMessage);
      socket.off("conversation_history", handleHistory);
      socket.off("online_users", handleOnlineUsers);
      socket.off("typing", handleTyping);
      socket.off("message_liked", handleLike);
      socket.off("connect", join);
    };
  }, [currentUser]);

  useEffect(() => {
    if (socket.connected && selectedUser) {
      socket.emit("get_conversation", {
        withUser: selectedUser.name,
      });
    }
  }, [selectedUser, currentUser]);

  const sendMessage = (text) => {
    if (!selectedUser || !text.trim()) return;

    const senderProfile = users.find((user) => user.name === currentUser);

    const messageData = {
      receiver: selectedUser.name,
      message: text.trim(),
      senderImage: senderProfile?.image,
    };

    // If the connection is still starting, wait for it and then send.
    // This prevents the typed message from disappearing.
    if (!socket.connected) {
      socket.once("connect", () => {
        socket.emit("private_message", messageData);
      });
      socket.connect();
      return;
    }

    socket.emit("private_message", messageData);
  };

  const likeMessage = (messageId) => {
    socket.emit("like_message", { messageId });
  };

  const handleTyping = () => {
    if (!selectedUser) return;

    socket.emit("typing", {
      receiver: selectedUser.name,
    });
  };

  const changeUser = (name) => {
    setCurrentUser(name);

    const nextFriend =
      users.find((user) => user.name !== name) || users[0];

    setSelectedUser(nextFriend);
    setTypingUser("");
  };

  const selectFriend = (user) => {
    if (user.name !== currentUser) {
      setSelectedUser(user);
      setTypingUser("");
    }
  };

  return (
    <div className="app">
      <div className="chat-app">
        <Sidebar
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
          setSelectedUser={selectFriend}
          onlineUsers={onlineUsers}
          setCurrentUser={changeUser}
        />

        <main className="chat-section">
          {selectedUser && (
            <>
              <ChatHeader
                user={selectedUser}
                online={onlineUsers.includes(selectedUser.name)}
              />

              <MessageList
                messages={selectedMessages}
                currentUser={currentUser}
                onLike={likeMessage}
                typingUser={
                  typingUser === selectedUser.name
                    ? typingUser
                    : ""
                }
              />

              <ChatInput
                onSend={sendMessage}
                onTyping={handleTyping}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;