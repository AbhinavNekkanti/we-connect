import { useEffect, useRef } from "react";
import Message from "./Message";

function MessageList({ messages, currentUser, onLike, typingUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  return (
    <div className="messages">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <div className="empty-icon">👋</div>
          <h3>Start a conversation</h3>
          <p>Send a message and say hello!</p>
        </div>
      ) : (
        messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            currentUser={currentUser}
            onLike={onLike}
          />
        ))
      )}

      {typingUser && (
        <div className="typing-indicator">
          <span />
          <span />
          <span />
          <b>{typingUser} is typing...</b>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;