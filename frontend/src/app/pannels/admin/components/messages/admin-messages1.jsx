import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { useAuth } from "../../../../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

function AdminMessages1Page() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            loadConversation(conversationId);
        }
    }, [conversationId, conversations]);

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

    // Format time for sidebar
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
        
        return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Format time for chat messages
    const formatChatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Get date label for grouping messages
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

    // Check if we need to show date separator
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
            
            <div className="wt-admin-dashboard-msg-2">
                {/*Left Msg section*/}
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
                    
                    {/* Search Section End*/}
                    <div className="msg-find-list">
                        <select className="wt-select-box bs-select-hidden">
                            <option>Recent Chats</option>
                            <option>Short by Time</option>
                            <option>Short by Unread</option>
                        </select>
                    </div>
                    
                    {/* user msg list start*/}
                    <div id="msg-list-wrap" className="wt-dashboard-msg-search-list scrollbar-macosx">
                        {filteredConversations.length === 0 ? (
                            <p className="text-center text-muted p-4">
                                {conversations.length === 0 
                                    ? 'No conversations yet.' 
                                    : 'No conversations match your search.'}
                            </p>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div key={conv.id} className="wt-dashboard-msg-search-list-wrap">
                                    <a 
                                        href="#" 
                                        className={`msg-user-info clearfix ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            loadConversation(conv.id);
                                        }}
                                        style={{ 
                                            backgroundColor: selectedConversation?.id === conv.id ? '#f0f8ff' : 'transparent'
                                        }}
                                    >
                                        <div className="msg-user-timing">
                                            {formatSidebarTime(conv.updated_at)}
                                        </div>
                                        <div className="msg-user-info-pic">
                                            <JobZImage 
                                                src={conv.other_participant?.profile_image || "images/user-avtar/pic1.jpg"} 
                                                alt="" 
                                            />
                                        </div>
                                        <div className="msg-user-info-text">
                                            <div className="msg-user-name">
                                                {conv.other_participant?.name || conv.other_participant?.email || 'Unknown User'}
                                                {conv.unread_count > 0 && (
                                                    <span className="badge bg-danger ms-2" style={{ fontSize: '10px', padding: '3px 7px' }}>
                                                        {conv.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                            {conv.last_message && (
                                                <div className="msg-user-discription">
                                                    {conv.last_message.body.substring(0, 40)}...
                                                </div>
                                            )}
                                        </div>
                                    </a>
                                </div>
                            ))
                        )}
                    </div>
                    {/* user msg list End*/}
                </div>

                {/*Right Msg section*/}
                <div className="wt-dashboard-msg-box">
                    {selectedConversation ? (
                        <>
                            <div className="single-msg-user-name-box">
                                <div className="single-msg-short-discription">
                                    <h4 className="single-msg-user-name">
                                        {selectedConversation.other_participant?.name || 
                                         selectedConversation.other_participant?.email || 
                                         'Unknown User'}
                                    </h4>
                                    {selectedConversation.other_participant?.user_type || ''}
                                </div>
                                <a href="#" className="message-action">
                                    <i className="far fa-trash-alt" /> Delete Conversation
                                </a>
                            </div>
                            
                            <div id="msg-chat-wrap" className="single-user-msg-conversation scrollbar-macosx">
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

                                                {/* Message */}
                                                <div className={isCurrentUser ? "single-user-comment-wrap sigle-user-reply" : "single-user-comment-wrap"}>
                                                    <div className={isCurrentUser ? "row justify-content-end" : "row"}>
                                                        <div className="col-xl-9 col-lg-12">
                                                            <div className="single-user-comment-block clearfix">
                                                                <div className="single-user-com-pic">
                                                                    <JobZImage 
                                                                        src={isCurrentUser ? "images/user-avtar/pic4.jpg" : (selectedConversation.other_participant?.profile_image || "images/user-avtar/pic1.jpg")} 
                                                                        alt="" 
                                                                    />
                                                                </div>
                                                                <div className="single-user-com-text">
                                                                    {msg.body}
                                                                </div>
                                                                <div className="single-user-msg-time">
                                                                    {formatChatTime(msg.created_at)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            
                            <div className="single-msg-reply-comment">
                                <form onSubmit={sendMessage}>
                                    <div className="input-group">
                                        <textarea 
                                            className="form-control" 
                                            placeholder="Type a message here"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            required
                                        />
                                        <button className="btn" type="submit">
                                            <i className="fa fa-paper-plane" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-5" style={{ paddingTop: '150px' }}>
                            <i className="far fa-comments" style={{ fontSize: '80px', color: '#e0e0e0' }} />
                            <h4 className="m-t20">Select a conversation</h4>
                            <p className="text-muted">Choose a conversation from the left to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminMessages1Page;
