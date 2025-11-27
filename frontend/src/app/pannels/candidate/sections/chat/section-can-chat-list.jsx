import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";

const API_URL = process.env.REACT_APP_API_URL;

function SectionCanChatList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
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

    const handleConversationClick = (convId) => {
        setSearchParams({ conversation: convId });
    };

    const filteredConversations = conversations.filter(conv => 
        conv.other_participant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.other_participant?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                
                {/* Search Section Start*/}
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
                                    className={`msg-user-info clearfix ${conversationId == conv.id ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleConversationClick(conv.id);
                                    }}
                                    style={{ 
                                        backgroundColor: conversationId == conv.id ? '#f0f8ff' : 'transparent'
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
        </>
    )
}

export default SectionCanChatList;
