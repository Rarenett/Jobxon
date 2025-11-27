import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";

const API_URL = process.env.REACT_APP_API_URL;

function EmpMessages2Page() {
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conv = conversations.find(c => c.id === parseInt(conversationId));
            if (conv) {
                loadConversation(conversationId);
            }
        }
    }, [conversationId, conversations]);

    const fetchConversations = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`${API_URL}/api/chat/conversations/`, {
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
            const res = await fetch(`${API_URL}/api/chat/conversations/${convId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setSelectedConversation(data);
            setMessages(data.messages || []);

            // Mark messages as read
            await fetch(`${API_URL}/api/chat/conversations/${convId}/mark_messages_read/`, {
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
                `${API_URL}/api/chat/conversations/${selectedConversation.id}/send_message/`,
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
                fetchConversations(); // Refresh conversation list
            }
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

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

            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="far fa-envelope" /> 
                        {selectedConversation 
                            ? `Chat with ${selectedConversation.other_participant.name}` 
                            : 'Inbox'}
                    </h4>
                </div>

                <div className="panel-body wt-panel-body bg-white">
                    {/* Conversation List */}
                    {!selectedConversation && conversations.length > 0 && (
                        <div className="mb-4">
                            <h5 className="mb-3">Your Conversations</h5>
                            {conversations.map((conv) => (
                                <div 
                                    key={conv.id}
                                    className="dashboard-messages-box"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => loadConversation(conv.id)}
                                >
                                    <div className="dashboard-message-avtar">
                                        <JobZImage 
                                            src={conv.other_participant.profile_image || "images/user-avtar/pic1.jpg"} 
                                            alt="" 
                                        />
                                    </div>
                                    <div className="dashboard-message-area">
                                        <h5>
                                            {conv.other_participant.name} 
                                            {conv.unread_count > 0 && (
                                                <span className="badge bg-danger ms-2">{conv.unread_count}</span>
                                            )}
                                            <span> - {formatDate(conv.updated_at)}</span>
                                        </h5>
                                        {conv.last_message && (
                                            <p>{conv.last_message.body.substring(0, 100)}...</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Conversation Messages */}
                    {selectedConversation && (
                        <>
                            <button 
                                className="btn btn-sm btn-secondary mb-3"
                                onClick={() => {
                                    setSelectedConversation(null);
                                    setMessages([]);
                                }}
                            >
                                <i className="fa fa-arrow-left"></i> Back to Conversations
                            </button>

                            {messages.length === 0 ? (
                                <p className="text-center text-muted">No messages yet. Start the conversation!</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className="dashboard-messages-box">
                                        <div className="dashboard-message-avtar">
                                            <JobZImage 
                                                src={msg.sender.profile_image || "images/user-avtar/pic1.jpg"} 
                                                alt="" 
                                            />
                                        </div>
                                        <div className="dashboard-message-area">
                                            <h5>
                                                {msg.sender_name} - <span>{formatDate(msg.created_at)} at {formatTime(msg.created_at)}</span>
                                            </h5>
                                            <p>{msg.body}</p>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Message Input */}
                            <div className="dashboard-message-reply-textarea p-a20 mt-4" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
                                <form onSubmit={sendMessage}>
                                    <div className="form-group wt-input-icon">
                                        <div className="input-group">
                                            <i className="input-group-addon fa fa-pencil v-align-t" />
                                            <textarea
                                                rows={4}
                                                cols={45}
                                                className="form-control"
                                                placeholder="Type your message *"
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-submit m-t10">
                                        <button className="site-button" type="submit">
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}

                    {conversations.length === 0 && !selectedConversation && (
                        <p className="text-center text-muted">No conversations yet. Start chatting with candidates!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default EmpMessages2Page;
