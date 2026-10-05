import { Search } from "lucide-react";

function Sidebar({
  users,
  currentUser,
  selectedUser,
  setSelectedUser,
  onlineUsers,
  setCurrentUser,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">💬</div>
        <div>
          <h1>We-Connect</h1>
          <p>Friends forever</p>
        </div>
      </div>

      <div className="profile-selector">
        <span className="profile-label">You are chatting as</span>
        <select
          value={currentUser}
          onChange={(event) => setCurrentUser(event.target.value)}
        >
          {users.map((user) => (
            <option key={user.name} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="friends-title">
        <span>Friends</span>
        <span className="friend-count">{users.length}</span>
      </div>

      <div className="search-box">
        <Search size={17} />
        <input placeholder="Search friends..." />
      </div>

      <div className="friends-list">
        {users.map((user) => {
          const isMe = user.name === currentUser;
          const isActive = selectedUser?.name === user.name;
          const isOnline = onlineUsers.includes(user.name);

          return (
            <button
              key={user.name}
              className={`friend-card ${isActive ? "active" : ""}`}
              onClick={() => !isMe && setSelectedUser(user)}
              disabled={isMe}
            >
              <div className="avatar-wrap">
                <img src={user.image} alt={user.name} className="avatar" />
                <span className={`status-dot ${isOnline ? "online" : ""}`} />
              </div>

              <div className="friend-details">
                <strong>{user.name}</strong>
                <span>
                  {isMe ? "You" : isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;