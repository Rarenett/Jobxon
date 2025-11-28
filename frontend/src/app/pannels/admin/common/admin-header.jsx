import JobZImage from "../../../common/jobz-img";
import { NavLink, useNavigate } from "react-router-dom";
import { adRoute, admin, publicUser } from "../../../../globals/route-names";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const IMG_BASE_URL = process.env.REACT_APP_API_URL;

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${IMG_BASE_URL}${imageUrl}`;
    return `${IMG_BASE_URL}/${imageUrl}`;
};

// Same avatar generator as employer
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
            fontSize: `${size * 0.45}px`,
            fontWeight: 'bold'
        }}>
            {initial}
        </div>
    );
};

function AdminHeaderSection(props) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchProfile();
        fetchRecentConversations();
        const interval = setInterval(fetchRecentConversations, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/api/profile/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(response.data.profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchRecentConversations = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`${API_URL}/api/conversations/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            // Only conversations with unread messages, limit 4
            const unreadConversations = data.filter(conv => conv.unread_count > 0).slice(0, 4);
            setConversations(unreadConversations);

            const totalUnread = data.reduce((sum, conv) => sum + conv.unread_count, 0);
            setUnreadCount(totalUnread);
        } catch (error) {
            console.error("Failed to load conversations", error);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    const handleLogout = () => {
        logout();
        navigate(publicUser.HOME1);
    };

    const handleConversationClick = async (convId) => {
        const token = localStorage.getItem("access_token");
        try {
            await fetch(`${API_URL}/api/conversations/${convId}/mark_messages_read/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove from dropdown list
            setConversations(prev => prev.filter(conv => conv.id !== convId));
            fetchRecentConversations();

            // Navigate to admin messages page
            navigate(`${adRoute(admin.MESSAGES1)}?conversation=${convId}`);
        } catch (error) {
            console.error("Failed to mark messages as read", error);
            navigate(`${adRoute(admin.MESSAGES1)}?conversation=${convId}`);
        }
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
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '';
                        const avatar = generateAvatar(participant?.name, participant?.email, size);
                        e.target.parentElement.appendChild(avatar);
                    }}
                />
            );
        }
        return generateAvatar(participant?.name, participant?.email, size);
    };

    return (
        <>
            <header id="header-admin-wrap" className="header-admin-fixed">
                <div id="header-admin" className={props.sidebarActive ? "" : "active"}>
                    <div className="container">
                        <div className="header-left">
                            <div className="nav-btn-wrap">
                                <a className="nav-btn-admin" id="sidebarCollapse" onClick={props.onClick}>
                                    <span className="fa fa-angle-left" />
                                </a>
                            </div>
                        </div>
                        <div className="header-right">
                            <ul className="header-widget-wrap">
                                {/* Messages (same pattern as employer) */}
                                <li className="header-widget dashboard-message-dropdown">
                                    <div className="dropdown">
                                        <a
                                            href="#"
                                            className="dropdown-toggle jobzilla-admin-messange"
                                            id="ID-MSG_dropdown"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="far fa-envelope" />
                                            {unreadCount > 0 && (
                                                <span className="notification-animate">{unreadCount}</span>
                                            )}
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="ID-MSG_dropdown" style={{ minWidth: '320px' }}>
                                            <div className="message-list dashboard-widget-scroll">
                                                <ul>
                                                    {conversations.length === 0 ? (
                                                        <li className="clearfix text-center p-3">
                                                            <p className="text-muted mb-0">No new messages</p>
                                                        </li>
                                                    ) : (
                                                        conversations.map((conv) => (
                                                            <li
                                                                key={conv.id}
                                                                className="clearfix"
                                                                onClick={() => handleConversationClick(conv.id)}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    padding: '12px 15px',
                                                                    borderBottom: '1px solid #f0f0f0',
                                                                    transition: 'background-color 0.2s',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '12px'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                            >
                                                                {/* Avatar / Logo */}
                                                                <div style={{ flexShrink: 0, width: '45px', height: '45px' }}>
                                                                    {renderProfileImage(conv.other_participant, 45)}
                                                                </div>

                                                                {/* Text */}
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                                        <strong style={{
                                                                            fontSize: '14px',
                                                                            color: '#1a1a1a',
                                                                            fontWeight: 600
                                                                        }}>
                                                                            {conv.other_participant?.name || conv.other_participant?.email || 'User'}
                                                                        </strong>
                                                                        <small style={{
                                                                            fontSize: '11px',
                                                                            color: '#22c55e',
                                                                            whiteSpace: 'nowrap',
                                                                            marginLeft: '8px'
                                                                        }}>
                                                                            {formatTimeAgo(conv.updated_at)}
                                                                        </small>
                                                                    </div>

                                                                    {conv.other_participant?.user_type && (
                                                                        <small style={{
                                                                            fontSize: '11px',
                                                                            color: '#999',
                                                                            textTransform: 'capitalize',
                                                                            display: 'block',
                                                                            marginBottom: '4px'
                                                                        }}>
                                                                            {conv.other_participant.user_type}
                                                                        </small>
                                                                    )}

                                                                    {conv.last_message && (
                                                                        <p style={{
                                                                            margin: 0,
                                                                            fontSize: '13px',
                                                                            color: '#666',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}>
                                                                            {conv.last_message.body.substring(0, 40)}
                                                                            {conv.last_message.body.length > 40 ? '...' : ''}
                                                                        </p>
                                                                    )}

                                                                    {conv.unread_count > 0 && (
                                                                        <span style={{
                                                                            display: 'inline-block',
                                                                            minWidth: '20px',
                                                                            height: '20px',
                                                                            borderRadius: '10px',
                                                                            backgroundColor: '#22c55e',
                                                                            color: '#fff',
                                                                            fontSize: '11px',
                                                                            fontWeight: 600,
                                                                            textAlign: 'center',
                                                                            lineHeight: '20px',
                                                                            marginTop: '4px'
                                                                        }}>
                                                                            {conv.unread_count}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                                <div className="message-view-all">
                                                    <NavLink to={adRoute(admin.MESSAGES1)}>View All Messages</NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Notifications (can be customized later) */}
                                <li className="header-widget dashboard-noti-dropdown">
                                    <div className="dropdown">
                                        <a href="#" className="dropdown-toggle jobzilla-admin-notification" id="ID-NOTI_dropdown" data-bs-toggle="dropdown">
                                            <i className="far fa-bell" />
                                            <span className="notification-animate">0</span>
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="ID-NOTI_dropdown">
                                            <div className="dashboard-widgets-header">You have 0 notifications</div>
                                            <div className="noti-list dashboard-widget-scroll">
                                                <ul>
                                                    <li className="text-center p-3">
                                                        <p className="text-muted mb-0">No notifications</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                                {/* Account */}
                                <li className="header-widget">
                                    <div className="dashboard-user-section">
                                        <div className="listing-user">
                                            <div className="dropdown">
                                                <a href="#" className="dropdown-toggle" id="ID-ACCOUNT_dropdown" data-bs-toggle="dropdown">
                                                    <div className="user-name text-black">
                                                        <span>
                                                            <JobZImage src="images/user-avtar/pic4.jpg" alt="" />
                                                        </span>
                                                        {profile?.name || user?.username || 'User'}
                                                    </div>
                                                </a>
                                                <div className="dropdown-menu" aria-labelledby="ID-ACCOUNT_dropdown">
                                                    <ul>
                                                        <li><NavLink to={adRoute(admin.DASHBOARD)}><i className="fa fa-home" />Dashboard</NavLink></li>
                                                        <li><NavLink to={adRoute(admin.MESSAGES1)}><i className="fa fa-envelope" /> Messages</NavLink></li>
                                                        <li><NavLink to={adRoute(admin.PROFILE)}><i className="fa fa-user" /> Profile</NavLink></li>
                                                        <li>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                                                <i className="fa fa-share-square" /> Logout
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default AdminHeaderSection;
