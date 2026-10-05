import { useState } from "react";

function Message({ message, currentUser, onLike }) {
  const isMine = message.sender === currentUser;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked((previous) => !previous);
    onLike(message.id);
  };

  return (
    <div className={`message-row ${isMine ? "mine" : "received"}`}>
      {!isMine && (
        <img
          src={message.senderImage}
          alt={message.sender}
          className="message-avatar"
        />
      )}

      <div className="message-content">
        <div className="message-bubble">
          {!isMine && (
            <span className="sender-name">{message.sender}</span>
          )}

          <p>{message.message}</p>
        </div>

        <div className="message-meta">
          <span>{message.time}</span>

          <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label={liked ? "Unlike message" : "Like message"}
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;