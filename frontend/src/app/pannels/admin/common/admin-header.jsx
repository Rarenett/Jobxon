import JobZImage from "../../../common/jobz-img";
import { NavLink, useNavigate } from "react-router-dom";
import { adRoute, admin, publicUser } from "../../../../globals/route-names";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function AdminHeaderSection(props) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchProfile();
        fetchRecentConversations();
        
        // Refresh conversations every 30 seconds
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
            
            // Get only first 4 conversations
            const recent = data.slice(0, 4);
            setConversations(recent);
            
            // Calculate total unread count
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

        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    const handleLogout = () => {
        logout();
        navigate(publicUser.HOME1);
    };

    const handleConversationClick = (convId) => {
        navigate(`${adRoute(admin.MESSAGES1)}?conversation=${convId}`);
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
                                {/*Message*/}
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
                                                                        src={conv.other_participant?.profile_image || "images/user-avtar/pic1.jpg"} 
                                                                        alt="" 
                                                                    />
                                                                </span>
                                                                <div className="msg-texting">
                                                                    <strong>
                                                                        {conv.other_participant?.name || conv.other_participant?.email || 'User'}
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
                                                    <NavLink to={adRoute(admin.MESSAGES1)}>View All</NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {/*Notification*/}
                                <li className="header-widget dashboard-noti-dropdown">
                                    <div className="dropdown">
                                        <a href="#" className="dropdown-toggle jobzilla-admin-notification" id="ID-NOTI_dropdown" data-bs-toggle="dropdown">
                                            <i className="far fa-bell" />
                                            <span className="notification-animate">8</span>
                                        </a>
                                        <div className="dropdown-menu" aria-labelledby="ID-NOTI_dropdown">
                                            <div className="dashboard-widgets-header">You have 7 notifications</div>
                                            <div className="noti-list dashboard-widget-scroll">
                                                <ul>
                                                    <li>
                                                        <a href="#">
                                                            <span className="noti-icon"><i className="far fa-bell" /></span>
                                                            <span className="noti-texting">Devid applied for <b>Webdesigner.</b> </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="noti-icon"><i className="far fa-bell" /></span>
                                                            <span className="noti-texting">Nikol sent you a message. </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="noti-icon"><i className="far fa-bell" /></span>
                                                            <span className="noti-texting">lucy bookmarked your <b>SEO Expert</b> Job! </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="noti-icon"><i className="far fa-bell" /></span>
                                                            <span className="noti-texting">Your job for <b>teacher</b> has been approved! </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="noti-icon"><i className="far fa-bell" /></span>
                                                            <span className="noti-texting">Thor applied for <b>Team Leader</b>. </span>
                                                        </a>
                                                    </li>
                                                </ul>
                                                <div className="noti-view-all">
                                                    <a href="#">View All</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {/*Account*/}
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
