import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";

const API_URL = process.env.REACT_APP_API_URL;
const IMG_BASE_URL = process.env.REACT_APP_API_URL;

// same helper you use in EmpMessages2Page header
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${IMG_BASE_URL}${imageUrl}`;
  return `${IMG_BASE_URL}/${imageUrl}`;
};

// simple avatar (you can reuse full generateAvatar if you want)
const generateAvatar = (name, email, size = 40) => {
  const displayName = name || email || "U";
  const initial = displayName.charAt(0).toUpperCase();
  const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#e74c3c",
    "#f39c12",
    "#16a085",
    "#27ae60",
  ];
  const colorIndex = displayName.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: `${size * 0.4}px`,
        fontWeight: "bold",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
};

const renderProfileImage = (participant, size = 40) => {
  const imageUrl = getImageUrl(participant?.logo || participant?.profile_image);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }

  return generateAvatar(participant?.name, participant?.email, size);
};

function SectionCanChatList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationId = searchParams.get("conversation");

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API_URL}/api/conversations/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      // Handle both array and paginated object responses
      const items = Array.isArray(data) ? data : (data.results || []);
      setConversations(items);
    } catch (error) {
      console.error("Failed to load conversations", error);
      setConversations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const formatSidebarTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24 && date.getDate() === now.getDate()) {
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / 60000);
        return diffMins <= 1 ? "Just now" : `${diffMins} mins ago`;
      }
      return `${diffHours} hours ago`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }

    if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleConversationClick = (convId) => {
    setSearchParams({ conversation: convId });
  };

  // Defensive filter - ensure conversations is always an array
  const filteredConversations = Array.isArray(conversations)
    ? conversations.filter(
        (conv) =>
          conv.other_participant?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          conv.other_participant?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="wt-dashboard-msg-user-list">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wt-dashboard-msg-user-list">
        <div className="user-msg-list-btn-outer">
          <button className="user-msg-list-btn-close">Close</button>
          <button className="user-msg-list-btn-open">User Message</button>
        </div>

        {/* Search Section */}
        <div className="wt-dashboard-msg-search">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Search Messages"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn" type="button">
              <i className="fa fa-search" />
            </button>
          </div>
        </div>

        <div className="msg-find-list">
          <select className="wt-select-box bs-select-hidden">
            <option>Recent Chats</option>
            <option>Short by Time</option>
            <option>Short by Unread</option>
          </select>
        </div>

        {/* User msg list – SAME DESIGN AS EMP/ADMIN SIDEBAR */}
        <div
          id="msg-list-wrap"
          className="wt-dashboard-msg-search-list scrollbar-macosx"
        >
          {filteredConversations.length === 0 ? (
            <p className="text-center text-muted p-4">
              {conversations.length === 0
                ? "No conversations yet."
                : "No conversations match your search."}
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <div key={conv.id} className="wt-dashboard-msg-search-list-wrap">
                <a
                  href="#"
                  className={`msg-user-info clearfix ${
                    conversationId == conv.id ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleConversationClick(conv.id);
                  }}
                  style={{
                    backgroundColor:
                      conversationId == conv.id ? "#f0f8ff" : "transparent",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* Avatar */}
                  <div style={{ flexShrink: 0 }}>
                    {renderProfileImage(conv.other_participant, 40)}
                  </div>

                  {/* Right content */}
                  <div
                    className="msg-user-info-text"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    {/* Top row: name + time + unread pill */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        className="msg-user-name"
                        style={{
                          fontWeight: conv.unread_count > 0 ? 600 : 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {conv.other_participant?.name ||
                          conv.other_participant?.email ||
                          "Unknown User"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "4px",
                          flexShrink: 0,
                        }}
                      >
                        <small
                          style={{
                            fontSize: "11px",
                            color: conv.unread_count > 0 ? "#22c55e" : "#999",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatSidebarTime(conv.updated_at)}
                        </small>

                        {conv.unread_count > 0 && (
                          <span
                            style={{
                              minWidth: "20px",
                              height: "20px",
                              borderRadius: "999px",
                              backgroundColor: "#22c55e",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Optional role */}
                    {conv.other_participant?.user_type && (
                      <small
                        style={{
                          fontSize: "11px",
                          color: "#999",
                          textTransform: "capitalize",
                          display: "block",
                        }}
                      >
                        {conv.other_participant.user_type}
                      </small>
                    )}

                    {/* Last message preview */}
                    {conv.last_message && (
                      <div
                        className="msg-user-discription"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "13px",
                          color: "#666",
                        }}
                      >
                        {conv.last_message.body.substring(0, 50)}
                        {conv.last_message.body.length > 50 ? "..." : ""}
                      </div>
                    )}
                  </div>
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SectionCanChatList;
