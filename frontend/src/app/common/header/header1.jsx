import JobZImage from "../jobz-img";
import { NavLink, useLocation } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Header1({ _config }) {
    const location = useLocation();
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
            fetchConversations();
        }
    }, [isAuthenticated, isCandidateRoute]);

    const checkAuthStatus = () => {
        const token = localStorage.getItem('access_token');
        console.log('Token exists:', !!token); // Debug log
        
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
            const response = await axios.get('http://127.0.0.1:8000/api/candidate/profile/', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUser(response.data);
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            if (error.response?.status === 401) {
                // Token is invalid, clear auth state
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setIsAuthenticated(false);
            }
        }
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8000/api/messages/conversations/', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setConversations(response.data);
            const unread = response.data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            setConversations([]);
            setUnreadCount(0);
        }
    };

    const handleConversationClick = (conversationId) => {
        window.location.href = `/candidate/messages/${conversationId}`;
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://127.0.0.1:8000${imagePath}`;
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
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
                                        {
                                            _config.withBlackLogo
                                                ?
                                                <JobZImage src="images/logo-12.png" alt="" />
                                                :
                                                (
                                                    _config.withWhiteLogo
                                                        ?
                                                        <JobZImage src="images/logo-white.png" alt="" />
                                                        :
                                                        (
                                                            _config.withLightLogo ?
                                                                <>
                                                                    <JobZImage id="skin_header_logo_light" src="images/logo-light-3.png" alt="" className="default-scroll-show" />
                                                                    <JobZImage id="skin_header_logo" src="images/logo-dark.png" alt="" className="on-scroll-show" />
                                                                </> :
                                                                <JobZImage id="skin_header_logo" src="images/logo-dark.png" alt="" />
                                                        )
                                                )
                                        }
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
                                    {/* Show authenticated UI only on candidate routes AND when logged in */}
                                    {isCandidateRoute && isAuthenticated ? (
                                        // Authenticated candidate UI
                                        <div className="header-right">
                                            <ul className="header-widget-wrap">
                                                {/* Message dropdown */}
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
                                                        <div className="dropdown-menu" aria-labelledby="ID-MSG_dropdown">
                                                            <div className="message-list dashboard-widget-scroll">
                                                                <ul>
                                                                    {conversations.length === 0 ? (
                                                                        <li className="clearfix text-center p-3">
                                                                            <p className="text-muted mb-0">No messages</p>
                                                                        </li>
                                                                    ) : (
                                                                        conversations.map((conv) => (
                                                                            <li
                                                                                key={conv.id}
                                                                                className="clearfix"
                                                                                onClick={() => handleConversationClick(conv.id)}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                <span className="msg-avtar">
                                                                                    <JobZImage
                                                                                        src={getImageUrl(conv.other_participant?.profile_image) || "images/user-avtar/pic1.jpg"}
                                                                                        alt=""
                                                                                    />
                                                                                </span>
                                                                                <div className="msg-texting">
                                                                                    <strong>
                                                                                        {conv.other_participant?.name}
                                                                                        {conv.unread_count > 0 && (
                                                                                            <span className="badge bg-danger ms-1" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                                                                                {conv.unread_count}
                                                                                            </span>
                                                                                        )}
                                                                                    </strong>
                                                                                    <small className="msg-time">
                                                                                        <span className="far fa-clock p-r-5" />
                                                                                        {formatTimeAgo(conv.updated_at)}
                                                                                    </small>
                                                                                    {conv.last_message && (
                                                                                        <p>{conv.last_message.body.substring(0, 50)}...</p>
                                                                                    )}
                                                                                </div>
                                                                            </li>
                                                                        ))
                                                                    )}
                                                                </ul>
                                                                <div className="message-view-all">
                                                                    <NavLink to="/candidate/messages">View All</NavLink>
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
                                                                            <img
                                                                                src={getImageUrl(profile?.profile_image) || "images/user-avtar/pic1.jpg"}
                                                                                alt="User Avatar"
                                                                                style={{
                                                                                    width: 40,
                                                                                    height: 40,
                                                                                    borderRadius: "50%",
                                                                                    objectFit: "cover",
                                                                                    marginRight: 8
                                                                                }}
                                                                                onError={e => {
                                                                                    e.target.src = 'images/user-avtar/pic1.jpg';
                                                                                }}
                                                                            />
                                                                        </span>
                                                                        {profile?.full_name || user?.username || 'User'}
                                                                    </div>
                                                                </a>
                                                                <div className="dropdown-menu" aria-labelledby="ID-ACCOUNT_dropdown">
                                                                    <ul>
                                                                        <li><NavLink to="/candidate/dashboard"><i className="fa fa-home" /> Dashboard</NavLink></li>
                                                                        <li><NavLink to="/candidate/messages"><i className="fa fa-envelope" /> Messages</NavLink></li>
                                                                        <li><NavLink to="/candidate/profile"><i className="fa fa-user" /> Profile</NavLink></li>
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
