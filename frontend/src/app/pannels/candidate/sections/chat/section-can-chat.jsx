import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { useAuth } from "../../../../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;
const IMG_BASE_URL = process.env.REACT_APP_API_URL;

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${IMG_BASE_URL}${imageUrl}`;
  return `${IMG_BASE_URL}/${imageUrl}`;
};

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

function SectionCanChat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversation");

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setSelectedConversation(null);
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversation = async (convId) => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API_URL}/api/conversations/${convId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSelectedConversation(data);
      setMessages(data.messages || []);

      await fetch(
        `${API_URL}/api/conversations/${convId}/mark_messages_read/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to load conversation", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(
        `${API_URL}/api/conversations/${selectedConversation.id}/send_message/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: messageInput }),
        }
      );

      if (res.ok) {
        const newMessage = await res.json();
        setMessages([newMessage, ...messages]);
        setMessageInput("");
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const formatChatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const shouldShowDateSeparator = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;

    const currentDate = new Date(currentMsg.created_at).toDateString();
    const previousDate = new Date(previousMsg.created_at).toDateString();

    return currentDate !== previousDate;
  };

  if (!selectedConversation) {
    return (
      <div className="wt-dashboard-msg-box">
        <div className="text-center p-5" style={{ paddingTop: "150px" }}>
          <i
            className="far fa-comments"
            style={{ fontSize: "80px", color: "#e0e0e0" }}
          />
          <h4 className="m-t20">Select a conversation</h4>
          <p className="text-muted">
            Choose a conversation from the left to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wt-dashboard-msg-box">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const employer = selectedConversation.other_participant;

  return (
    <div className="wt-dashboard-msg-box">
      <div
        className="panel panel-default site-bg-white"
        style={{ height: "100%" }}
      >
        {/* Header same as employee */}
        <div
          className="panel-heading wt-panel-heading p-a20"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
          <div style={{ flexShrink: 0 }}>
            {renderProfileImage(employer, 45)}
          </div>

          <div style={{ flex: 1 }}>
            <h4
              className="panel-tittle m-a0"
              style={{ marginBottom: "4px" }}
            >
              {employer?.name || employer?.email || "Unknown User"}
            </h4>
            <p
              className="m-a0"
              style={{ fontSize: "13px", color: "#666", marginBottom: "2px" }}
            >
              {employer?.email || ""}
            </p>
            {employer?.user_type && (
              <p
                className="m-a0"
                style={{
                  fontSize: "12px",
                  color: "#999",
                  textTransform: "capitalize",
                }}
              >
                {employer.user_type}
              </p>
            )}
          </div>

          <button className="site-button-link text-danger">
            <i className="fa fa-trash" /> Delete Conversation
          </button>
        </div>

        {/* Messages area with bubbles */}
        <div
          className="panel-body wt-panel-body"
          style={{
            minHeight: "500px",
            maxHeight: "500px",
            overflowY: "auto",
            padding: "20px",
            background: "#f5f5f5",
          }}
        >
          {messages.length === 0 ? (
            <p className="text-center text-muted p-5">
              No messages yet. Start the conversation!
            </p>
          ) : (
            [...messages].reverse().map((msg, index) => {
              const isCurrentUser =
                msg.sender === user?.id || msg.sender_email === user?.email;
              const reversedMessages = [...messages].reverse();
              const previousMsg =
                index > 0 ? reversedMessages[index - 1] : null;
              const showDateSeparator = shouldShowDateSeparator(
                msg,
                previousMsg
              );

              return (
                <div key={msg.id}>
                  {showDateSeparator && (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "20px 0",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          background: "#e1f3fb",
                          padding: "5px 15px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          color: "#54656f",
                          fontWeight: "500",
                        }}
                      >
                        {getDateLabel(msg.created_at)}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                      marginBottom: "15px",
                      gap: "8px",
                    }}
                  >
                    {!isCurrentUser && (
                      <div style={{ flexShrink: 0, marginTop: "2px" }}>
                        {renderProfileImage(employer, 32)}
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: "65%",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        backgroundColor: isCurrentUser
                          ? "rgb(205 238 245)"
                          : "#fff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        position: "relative",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 5px 0",
                          fontSize: "14px",
                          wordWrap: "break-word",
                          color: "#111",
                          lineHeight: "1.5",
                        }}
                      >
                        {msg.body}
                      </p>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#667781",
                          textAlign: "right",
                          marginTop: "4px",
                        }}
                      >
                        {formatChatTime(msg.created_at)}
                      </div>
                    </div>

                    {isCurrentUser && (
                      <div style={{ flexShrink: 0, marginTop: "2px" }}>
                        {/* Candidate avatar; you can plug candidate profile image here if available */}
                        <JobZImage
                          src="images/user-avtar/pic1.jpg"
                          alt=""
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input bar */}
        <div
          className="panel-footer"
          style={{ background: "#f0f2f5", padding: "20px" }}
        >
          <form onSubmit={sendMessage}>
            <div className="dashboard-message-reply-textarea">
              <div className="form-group">
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Type your message *"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  required
                  style={{ resize: "none" }}
                />
              </div>
              <div className="form-submit m-t10">
                <button className="site-button" type="submit">
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SectionCanChat;
