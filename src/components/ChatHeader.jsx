import { useState } from "react";
import { MoreVertical, Phone, Video, X } from "lucide-react";

function ChatHeader({ user, online }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="chat-header">
        <div className="header-user">
          <button
            className="profile-photo-button"
            onClick={() => setShowProfile(true)}
            aria-label={`View ${user.name}'s profile photo`}
          >
            <div className="avatar-wrap large">
              <img
                src={user.image}
                alt={user.name}
                className="avatar"
              />
              <span className={`status-dot ${online ? "online" : ""}`} />
            </div>
          </button>

          <div>
            <h2>{user.name}</h2>
            <p>{online ? "Online now" : "Offline"}</p>
          </div>
        </div>

        <div className="header-actions">
          <button aria-label="Call">
            <Phone size={19} />
          </button>

          <button aria-label="Video call">
            <Video size={20} />
          </button>

          <button aria-label="More">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {showProfile && (
        <div
          className="profile-overlay"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="profile-preview"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="profile-close"
              onClick={() => setShowProfile(false)}
              aria-label="Close profile photo"
            >
              <X size={21} />
            </button>

            <img
              src={user.image}
              alt={user.name}
              className="profile-large-image"
            />

            <h3>{user.name}</h3>
            <p>{online ? "Online now" : "Offline"}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatHeader;