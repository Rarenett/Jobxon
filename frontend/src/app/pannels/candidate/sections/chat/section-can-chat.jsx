import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { useAuth } from "../../../../../contexts/AuthContext";

const API_URL = process.env.REACT_APP_API_URL;

function SectionCanChat() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
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

            // Mark messages as read
            await fetch(`${API_URL}/api/conversations/${convId}/mark_messages_read/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
            }
        } catch (error) {
            console.error("Failed to send message", error);
        }
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

    if (!selectedConversation) {
        return (
            <div className="wt-dashboard-msg-box">
                <div className="text-center p-5" style={{ paddingTop: '150px' }}>
                    <i className="far fa-comments" style={{ fontSize: '80px', color: '#e0e0e0' }} />
                    <h4 className="m-t20">Select a conversation</h4>
                    <p className="text-muted">Choose a conversation from the left to start messaging</p>
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

    return (
        <>
            <div className="wt-dashboard-msg-box">
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
                                                            src={isCurrentUser ? "images/user-avtar/pic1.jpg" : (selectedConversation.other_participant?.profile_image || "images/user-avtar/pic4.jpg")} 
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
            </div>
        </>
    )
}

export default SectionCanChat;
