import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { setMenuActive } from "../../../../globals/constants";
import { candidate, canRoute, publicUser } from "../../../../globals/route-names";
import JobZImage from "../../../common/jobz-img";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function CanSidebarSection() {
    const currentpath = useLocation().pathname;
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/profile/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data.profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate(publicUser.HOME1);
    };

    return (
        <>
            <div className="twm-candidate-profile-pic">
                <JobZImage src="images/user-avtar/pic4.jpg" alt="" />
                <div className="upload-btn-wrapper">
                    <div id="upload-image-grid" />
                    <button className="site-button button-sm">Upload Photo</button>
                    <input type="file" name="myfile" id="file-uploader" accept=".jpg, .jpeg, .png" />
                </div>
            </div>
            <div className="twm-mid-content text-center">
                <a href="#" className="twm-job-title">
                    <h4>{loading ? 'Loading...' : (profile?.name || user?.username || 'User')}</h4>
                </a>
                <p>{profile?.job_title || 'IT Contractor'}</p>
            </div>
            <div className="twm-nav-list-1">
                <ul>
                    <li className={setMenuActive(currentpath, canRoute(candidate.DASHBOARD))}>
                        <NavLink to={canRoute(candidate.DASHBOARD)}>
                            <i className="fa fa-tachometer-alt" />
                            Dashboard
                        </NavLink>
                    </li>
                    <li className={setMenuActive(currentpath, canRoute(candidate.PROFILE))}>
                        <NavLink to={canRoute(candidate.PROFILE)}>
                            <i className="fa fa-user" />
                            My Profile
                        </NavLink>
                    </li>
                    <li><a href="candidate-jobs-applied.html"><i className="fa fa-suitcase" /> Applied Jobs</a></li>
                    <li><a href="candidate-my-resume.html"><i className="fa fa-receipt" /> My Resume</a></li>
                    <li><a href="candidate-saved-jobs.html"><i className="fa fa-file-download" /> Saved Jobs</a></li>
                    <li><a href="candidate-job-alert.html"><i className="fa fa-bell" /> Job Alerts</a></li>
                    <li><a href="candidate-change-password.html"><i className="fa fa-fingerprint" /> Change Password</a></li>
                    <li><a href="candidate-chat.html"><i className="fa fa-comments" />Chat</a></li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                            <i className="fa fa-share-square" /> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default CanSidebarSection;
