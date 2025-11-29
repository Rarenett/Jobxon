import JobZImage from "../jobz-img";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";
const IMG_BASE_URL = "http://127.0.0.1:8000";

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${IMG_BASE_URL}${imageUrl}`;
    return `${IMG_BASE_URL}/${imageUrl}`;
};

// Generate avatar with first letter (same as employer)
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

function Header1({ _config }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);

    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    // Message state
    const [conversations, setConversations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Check if current route is a candidate route
    const isCandidateRoute = location.pathname.startsWith('/candidate');

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Fetch conversations when authenticated and on candidate route
    useEffect(() => {
        if (isAuthenticated && isCandidateRoute) {
            fetchRecentConversations();

            // Auto-refresh every 30 seconds
            const interval = setInterval(fetchRecentConversations, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, isCandidateRoute]);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('access_token');

        if (token) {
            setIsAuthenticated(true);
            fetchUserProfile();
        } else {
            setIsAuthenticated(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            console.log('Token:', token); // Check if token exists

            const response = await axios.get(`${API_URL}/api/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API Response:', response.data); // See what API returns
            setUser(response.data);
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            console.error('Error response:', error.response?.data); // See exact error
            console.error('Error status:', error.response?.status);

            if (error.response?.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsAuthenticated(false);
            }
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

            // Only show conversations with unread messages, max 4
            const unreadConversations = data.filter(conv => conv.unread_count > 0).slice(0, 4);
            setConversations(unreadConversations);

            // Calculate total unread count
            const totalUnread = data.reduce((sum, conv) => sum + conv.unread_count, 0);
            setUnreadCount(totalUnread);
        } catch (error) {
            console.error("Failed to load conversations", error);
            setConversations([]);
            setUnreadCount(0);
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

    const handleConversationClick = async (convId) => {
        const token = localStorage.getItem("access_token");
        try {
            // Mark as read
            await fetch(`${API_URL}/api/conversations/${convId}/mark_messages_read/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove from dropdown immediately
            setConversations(prev => prev.filter(conv => conv.id !== convId));

            // Refresh conversations
            fetchRecentConversations();

            // Navigate with query param
            navigate(`/candidate/chat?conversation=${convId}`);
        } catch (error) {
            console.error("Failed to mark messages as read", error);
            navigate(`/candidate/chat?conversation=${convId}`);
        }
    };

    // Render profile image or avatar (same as employer)
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
                            font-size: ${size * 0.45}px;
                            font-weight: bold;
                        `;
                        avatarDiv.textContent = initial;
                        e.target.parentElement.appendChild(avatarDiv);
                    }}
                />
            );
        }

        return generateAvatar(participant?.name, participant?.email, size);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        window.location.href = '/';
    };

    function handleNavigationClick() {
        setMenuActive(!menuActive);
    }

    return (
        <>
            <header className={"site-header " + _config.style + " mobile-sider-drawer-menu " + (menuActive ? "active" : "")}>
                <div className="sticky-header main-bar-wraper navbar-expand-lg">
                    <div className="main-bar">
                        <div className="container-fluid clearfix">
                            <div className="logo-header">
                                <div className="logo-header-inner logo-header-one">
                                    <NavLink to={publicUser.HOME1}>
                                        <JobZImage src="images/jobxon-logo.png" alt="" />
                                    </NavLink>
                                </div>
                            </div>

                            {/* NAV Toggle Button */}
                            <button id="mobile-side-drawer"
                                data-target=".header-nav"
                                data-toggle="collapse"
                                type="button"
                                className="navbar-toggler collapsed"
                                onClick={handleNavigationClick}
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar icon-bar-first" />
                                <span className="icon-bar icon-bar-two" />
                                <span className="icon-bar icon-bar-three" />
                            </button>

                            {/* MAIN Nav */}
                            <div className="nav-animation header-nav navbar-collapse collapse d-flex justify-content-center">
                                <ul className=" nav navbar-nav">
                                    <li className="has-child"><NavLink to={publicUser.pages.ABOUT}>About</NavLink></li>
                                    <li className="has-child"><a href="#">Jobs</a>
                                        <ul className="sub-menu">
                                            <li><NavLink to={publicUser.jobs.GRID}>Jobs For You</NavLink></li>
                                            <li><NavLink to={publicUser.jobs.GRID_MAP}>Preffered Jobs</NavLink></li>
                                        </ul>
                                    </li>
                                    <li className="has-child"><NavLink to={publicUser.employer.GRID}>Companies</NavLink></li>
                                    <li className="has-child"><NavLink to={publicUser.blog.GRID2}>Blog</NavLink></li>
                                    <li className="has-child"><NavLink to={publicUser.pages.CONTACT}>Contact Us</NavLink></li>
                                </ul>
                            </div>

                            {/* Header Right Section*/}
                            <div className="extra-nav header-2-nav">
                                <div className="extra-cell">
                                    <div className="header-search">
                                        <a href="#search" className="header-search-icon">
                                            <i className="feather-search" />
                                        </a>
                                    </div>
                                </div>
                                <div className="extra-cell">
                                    {isCandidateRoute && isAuthenticated ? (
                                        <div className="header-right">
                                            <ul className="header-widget-wrap">
                                                {/* Message dropdown - SAME AS EMPLOYER */}
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
                                                                                {/* Profile Image/Avatar */}
                                                                                <div style={{ flexShrink: 0, width: '45px', height: '45px' }}>
                                                                                    {renderProfileImage(conv.other_participant, 45)}
                                                                                </div>

                                                                                {/* Message Content */}
                                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                                                        <strong style={{
                                                                                            fontSize: '14px',
                                                                                            color: '#1a1a1a',
                                                                                            fontWeight: 600
                                                                                        }}>
                                                                                            {conv.other_participant?.name || conv.other_participant?.email || 'Unknown User'}
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

                                                                                    {/* User Type */}
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

                                                                                    {/* Message Preview */}
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

                                                                                    {/* Unread Badge */}
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
                                                                    <NavLink to="/candidate/chat">View All Messages</NavLink>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                {/* Notification dropdown */}
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
                                                {/* Account dropdown */}
                                                <li className="header-widget">
                                                    <div className="dashboard-user-section">
                                                        <div className="listing-user">
                                                            <div className="dropdown">
                                                                <a href="#" className="dropdown-toggle" id="ID-ACCOUNT_dropdown" data-bs-toggle="dropdown">
                                                                    <div className="user-name text-black">
                                                                        <span>
                                                                            {(() => {
                                                                                const imageUrl = getImageUrl(profile?.profile_image);

                                                                                if (imageUrl) {
                                                                                    return (
                                                                                        <img
                                                                                            src={imageUrl}
                                                                                            alt="User Avatar"
                                                                                            style={{
                                                                                                width: 40,
                                                                                                height: 40,
                                                                                                borderRadius: "50%",
                                                                                                objectFit: "cover",
                                                                                                marginRight: 8
                                                                                            }}
                                                                                            onError={(e) => {
                                                                                                // Replace with avatar on error
                                                                                                e.target.style.display = 'none';
                                                                                                const parent = e.target.parentElement;
                                                                                                const avatarDiv = document.createElement('div');
                                                                                                const displayName = profile?.username || user?.name || 'U';
                                                                                                const initial = displayName.charAt(0).toUpperCase();
                                                                                                const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#16a085', '#27ae60'];
                                                                                                const colorIndex = displayName.charCodeAt(0) % colors.length;
                                                                                                const bgColor = colors[colorIndex];

                                                                                                avatarDiv.style.cssText = `
                                                    width: 40px;
                                                    height: 40px;
                                                    border-radius: 50%;
                                                    background-color: ${bgColor};
                                                    display: flex;
                                                    align-items: center;
                                                    justify-content: center;
                                                    color: white;
                                                    font-size: 18px;
                                                    font-weight: bold;
                                                    margin-right: 8px;
                                                `;
                                                                                                avatarDiv.textContent = initial;
                                                                                                parent.appendChild(avatarDiv);
                                                                                            }}
                                                                                        />
                                                                                    );
                                                                                }

                                                                                // No image, show avatar directly
                                                                                return (
                                                                                    <div style={{
                                                                                        width: '40px',
                                                                                        height: '40px',
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: (() => {
                                                                                            const displayName = profile?.full_name || user?.username || 'U';
                                                                                            const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#16a085', '#27ae60'];
                                                                                            const colorIndex = displayName.charCodeAt(0) % colors.length;
                                                                                            return colors[colorIndex];
                                                                                        })(),
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        color: 'white',
                                                                                        fontSize: '18px',
                                                                                        fontWeight: 'bold',
                                                                                        marginRight: '8px'
                                                                                    }}>
                                                                                        {(profile?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </span>

                                                                        {profile?.username || user?.username || 'User'}
                                                                    </div>
                                                                </a>
                                                                <div className="dropdown-menu" aria-labelledby="ID-ACCOUNT_dropdown">
                                                                    <ul>
                                                                        <li><NavLink to="/candidate/dashboard"><i className="fa fa-home" /> Dashboard</NavLink></li>
                                                                        <li><NavLink to="/candidate/chat"><i className="fa fa-envelope" /> Messages</NavLink></li>
                                                                        <li><NavLink to="/candidate/profile"><i className="fa fa-user" /> Profile</NavLink></li>

                                                                         <li>
                                                                                                <NavLink to="/candidate/change-password">
                                                                                                    <i className="fa fa-fingerprint" />
                                                                                                    Change Password
                                                                                                </NavLink>
                                                                                            </li>
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
                                    ) : (
                                        // Public UI - Sign In/Sign Up buttons
                                        <div className="header-nav-btn-section">
                                            <div className="twm-nav-btn-left">
                                                <a className="twm-nav-sign-up" data-bs-toggle="modal" href="#sign_up_popup" role="button">
                                                    <i className="feather-log-in" /> Sign Up
                                                </a>
                                            </div>
                                            <div className="twm-nav-btn-right">
                                                <a className="twm-nav-post-a-job" data-bs-toggle="modal" href="#sign_up_popup2" role="button">
                                                    <i className="feather-log-in" /> Sign In
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SITE Search */}
                    <div id="search">
                        <span className="close" />
                        <form role="search" id="searchform" action="/search" method="get" className="radius-xl">
                            <input className="form-control" name="q" type="search" placeholder="Type to search" />
                            <span className="input-group-append">
                                <button type="button" className="search-btn">
                                    <i className="fa fa-paper-plane" />
                                </button>
                            </span>
                        </form>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header1;
