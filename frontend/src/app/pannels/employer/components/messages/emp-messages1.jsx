import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { useAuth } from "../../../../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;
const IMG_BASE_URL = process.env.REACT_APP_API_URL;

// Use the same getImageUrl function from your header
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${IMG_BASE_URL}${imageUrl}`;
    return `${IMG_BASE_URL}/${imageUrl}`;
};

function EmpMessages2Page() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUserProfile, setCurrentUserProfile] = useState(null);

    useEffect(() => {
        fetchConversations();
        fetchCurrentUserProfile();
    }, []);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            loadConversation(conversationId);
        }
    }, [conversationId, conversations]);

    const fetchCurrentUserProfile = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`${API_URL}/api/profiles/current/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setCurrentUserProfile(data);
        } catch (error) {
            console.error("Failed to load current user profile", error);
        }
    };

    const fetchConversations = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`${API_URL}/api/conversations/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const loadConversation = async (convId) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`${API_URL}/api/conversations/${convId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log(data)
            setSelectedConversation(data);
            setMessages(data.messages || []);

            // Mark messages as read
            await fetch(`${API_URL}/api/conversations/${convId}/mark_messages_read/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Failed to load conversation", error);
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
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ body: messageInput }),
                }
            );

            if (res.ok) {
                const newMessage = await res.json();
                setMessages([newMessage, ...messages]);
                setMessageInput('');
                fetchConversations();
            }
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    // Generate avatar from name/email (first letter)
    const generateAvatar = (name, email, size = 40) => {
        const displayName = name || email || 'U';
        const initial = displayName.charAt(0).toUpperCase();
        const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#16a085', '#27ae60'];
        const colorIndex = displayName.charCodeAt(0) % colors.length;
        const bgColor = colors[colorIndex];

        return (
            <div style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: `${size * 0.4}px`,
                fontWeight: 'bold',
                flexShrink: 0
            }}>
                {initial}
            </div>
        );
    };

    // Render profile image or avatar - only show avatar if no image
    const renderProfileImage = (participant, size = 40) => {
        // Check for logo (company/employer) or profile_image (candidate)
        const imageUrl = getImageUrl(participant?.logo || participant?.profile_image);

        if (imageUrl) {
            return (
                <img
                    src={imageUrl}
                    alt=""
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                    }}
                    onError={(e) => {
                        // If image fails to load, replace with avatar
                        const parent = e.target.parentElement;
                        e.target.style.display = 'none';
                        const avatarDiv = document.createElement('div');
                        const displayName = participant?.name || participant?.email || 'U';
                        const initial = displayName.charAt(0).toUpperCase();
                        const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#16a085', '#27ae60'];
                        const colorIndex = displayName.charCodeAt(0) % colors.length;
                        const bgColor = colors[colorIndex];

                        avatarDiv.style.cssText = `
                            width: ${size}px;
                            height: ${size}px;
                            border-radius: 50%;
                            background-color: ${bgColor};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: ${size * 0.4}px;
                            font-weight: bold;
                            flex-shrink: 0;
                        `;
                        avatarDiv.textContent = initial;
                        parent.appendChild(avatarDiv);
                    }}
                />
            );
        }

        // No image, show avatar
        return generateAvatar(participant?.name, participant?.email, size);
    };

    // Format time for sidebar (WhatsApp style)
    const formatSidebarTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffHours < 24 && date.getDate() === now.getDate()) {
            if (diffHours === 0) {
                const diffMins = Math.floor(diffMs / 60000);
                return diffMins <= 1 ? 'Just now' : `${diffMins} mins ago`;
            }
            return `${diffHours} hours ago`;
        }

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()) {
            return 'Yesterday';
        }

        if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatChatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDateLabel = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const isToday = date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (isToday) return 'Today';

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();

        if (isYesterday) return 'Yesterday';

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const shouldShowDateSeparator = (currentMsg, previousMsg) => {
        if (!previousMsg) return true;

        const currentDate = new Date(currentMsg.created_at).toDateString();
        const previousDate = new Date(previousMsg.created_at).toDateString();

        return currentDate !== previousDate;
    };

    const filteredConversations = conversations.filter(conv =>
        conv.other_participant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.other_participant?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Messages</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Messages</span>
                </div>
            </div>

            <div className="twm-pro-view-chart-wrap">
                <div className="row">
                    {/* LEFT SIDEBAR - Conversation List */}
                    <div className="col-xl-4 col-lg-5 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white">
                            <div className="panel-heading wt-panel-heading p-a20">
                                <h4 className="panel-tittle m-a0">
                                    <i className="far fa-envelope" /> Inbox
                                </h4>
                            </div>
                            <div className="panel-body wt-panel-body">
                                {/* Search Box */}
                                <div className="dashboard-messages-search-bar m-b20">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Messages"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button className="btn" type="button">
                                            <i className="fa fa-search" />
                                        </button>
                                    </div>
                                </div>

                                {/* Conversation List */}
                                <div className="dashboard-chat-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {filteredConversations.length === 0 ? (
                                        <p className="text-center text-muted p-4">
                                            {conversations.length === 0
                                                ? 'No conversations yet.'
                                                : 'No conversations match your search.'}
                                        </p>
                                    ) : (
                                        filteredConversations.map((conv) => (
                                            <div
                                                key={conv.id}
                                                className={`dashboard-messages-box ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: selectedConversation?.id === conv.id ? '#f0f8ff' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '10px 12px',
                                                    borderBottom: '1px solid #eee',
                                                    gap: '8px'  // Reduced from 10px to 8px
                                                }}
                                                onClick={() => loadConversation(conv.id)}
                                            >
                                                {/* Round Profile Image - Reduced gap */}
                                                <div style={{ flexShrink: 0 }}>
                                                    {renderProfileImage(conv.other_participant, 48)}  {/* Slightly smaller: 48px instead of 50px */}
                                                </div>

                                                <div className="dashboard-message-area" style={{ flex: 1, minWidth: 0 }}>
                                                    <h5 style={{ margin: '0 0 3px 0', fontSize: '15px', fontWeight: '600' }}>
                                                        {conv.other_participant?.name || conv.other_participant?.email || 'Unknown User'}
                                                        {conv.unread_count > 0 && (
                                                            <span className="badge bg-danger ms-2" style={{ fontSize: '10px', padding: '3px 7px' }}>
                                                                {conv.unread_count}
                                                            </span>
                                                        )}
                                                    </h5>

                                                    {/* Role displayed below name/email */}
                                                    {conv.other_participant?.user_type && (
                                                        <small style={{
                                                            fontSize: '11px',
                                                            color: '#999',
                                                            display: 'block',
                                                            marginBottom: '3px',
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {conv.other_participant.user_type}
                                                        </small>
                                                    )}

                                                    <small className="msg-time" style={{ fontSize: '11px', color: '#999' }}>
                                                        {formatSidebarTime(conv.updated_at)}
                                                    </small>

                                                    {conv.last_message && (
                                                        <p style={{
                                                            marginTop: '4px',
                                                            fontSize: '13px',
                                                            color: '#666',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            marginBottom: 0
                                                        }}>
                                                            {conv.last_message.body.substring(0, 50)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT SECTION - Selected Chat Messages */}
                    <div className="col-xl-8 col-lg-7 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white">
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header with Profile Image */}
                                    <div className="panel-heading wt-panel-heading p-a20" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {/* Profile Image in Header */}
                                        <div style={{ flexShrink: 0 }}>
                                            {renderProfileImage(selectedConversation.other_participant, 45)}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h4 className="panel-tittle m-a0" style={{ marginBottom: '4px' }}>
                                                {selectedConversation.other_participant.name ||
                                                    selectedConversation.other_participant?.email ||
                                                    'Unknown User'}
                                            </h4>
                                            <p className="m-a0" style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>
                                                {selectedConversation.other_participant?.email || ''}
                                            </p>
                                            {/* Role below email */}
                                            {selectedConversation.other_participant?.user_type && (
                                                <p className="m-a0" style={{ fontSize: '12px', color: '#999', textTransform: 'capitalize' }}>
                                                    {selectedConversation.other_participant.user_type}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            className="site-button-link text-danger"
                                        >
                                            <i className="fa fa-trash" />
                                        </button>
                                    </div>


                                    {/* Messages Area */}
                                    <div className="panel-body wt-panel-body" style={{ minHeight: '500px', maxHeight: '500px', overflowY: 'auto', padding: '20px', background: '#f5f5f5' }}>
                                        {messages.length === 0 ? (
                                            <p className="text-center text-muted p-5">
                                                No messages yet. Start the conversation!
                                            </p>
                                        ) : (
                                            [...messages].reverse().map((msg, index) => {
                                                const isCurrentUser = msg.sender === user?.id || msg.sender_email === user?.email;
                                                const reversedMessages = [...messages].reverse();
                                                const previousMsg = index > 0 ? reversedMessages[index - 1] : null;
                                                const showDateSeparator = shouldShowDateSeparator(msg, previousMsg);

                                                return (
                                                    <div key={msg.id}>
                                                        {/* Date Separator */}
                                                        {showDateSeparator && (
                                                            <div style={{
                                                                textAlign: 'center',
                                                                margin: '20px 0',
                                                                position: 'relative'
                                                            }}>
                                                                <span style={{
                                                                    background: '#e1f3fb',
                                                                    padding: '5px 15px',
                                                                    borderRadius: '10px',
                                                                    fontSize: '12px',
                                                                    color: '#54656f',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {getDateLabel(msg.created_at)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Message with Profile Image on Left */}
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                                                marginBottom: '15px',
                                                                gap: '8px'
                                                            }}
                                                        >
                                                            {/* Profile Image - Left side of message */}
                                                            {!isCurrentUser && (
                                                                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                                                    {renderProfileImage(selectedConversation.other_participant, 32)}
                                                                </div>
                                                            )}

                                                            {/* Message Bubble */}
                                                            <div
                                                                style={{
                                                                    maxWidth: '65%',
                                                                    padding: '10px 14px',
                                                                    borderRadius: '10px',
                                                                    backgroundColor: isCurrentUser ? '#d9fdd3' : '#fff',
                                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                                    position: 'relative'
                                                                }}
                                                            >
                                                                <p style={{
                                                                    margin: '0 0 5px 0',
                                                                    fontSize: '14px',
                                                                    wordWrap: 'break-word',
                                                                    color: '#111',
                                                                    lineHeight: '1.5'
                                                                }}>
                                                                    {msg.body}
                                                                </p>
                                                                <div style={{
                                                                    fontSize: '11px',
                                                                    color: '#667781',
                                                                    textAlign: 'right',
                                                                    marginTop: '4px'
                                                                }}>
                                                                    {formatChatTime(msg.created_at)}
                                                                </div>
                                                            </div>

                                                            {/* Profile Image for Current User - Left side (only if logo exists) */}
                                                            {isCurrentUser && (
                                                                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                                                    {renderProfileImage(currentUserProfile, 32)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <div className="panel-footer" style={{ background: '#f0f2f5', padding: '20px' }}>
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
                                                        style={{ resize: 'none' }}
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
                                </>
                            ) : (
                                <div className="panel-body wt-panel-body" style={{ minHeight: '500px' }}>
                                    <div className="text-center p-5" style={{ paddingTop: '150px' }}>
                                        <i className="far fa-comments" style={{ fontSize: '80px', color: '#e0e0e0' }} />
                                        <h4 className="m-t20">Select a conversation</h4>
                                        <p className="text-muted">Choose a conversation from the left to start messaging</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmpMessages2Page;
