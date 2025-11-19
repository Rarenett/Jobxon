import SectionCandidateOverview from "../sections/dashboard/section-can-overview";
import SectionCandidateInbox from "../sections/dashboard/section-can-inbox";
import SectionCandidateProfileViews from "../sections/dashboard/section-can-profile-views";
import SectionCandidateRecentActivities from "../sections/dashboard/section-can-activities";
import SectionCandidateRecentApplications from "../sections/dashboard/section-can-applications";
import { useEffect, useState } from "react";
import { loadScript } from "../../../../globals/constants";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

const API_URL = "http://localhost:8000/api";

function CanDashboardPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadScript("js/custom.js");
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

    return (
        <>
            <div className="twm-right-section-panel site-bg-gray">
                <SectionCandidateOverview 
                    profile={profile} 
                    loading={loading}
                    userName={profile?.name || user?.username || 'User'}
                />

                <div className="twm-pro-view-chart-wrap">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 mb-4">
                            <SectionCandidateProfileViews />
                        </div>
                        <div className="col-xl-12 col-lg-12 col-md-12 mb-4">
                            <SectionCandidateInbox />
                        </div>
                        <div className="col-lg-12 col-md-12 mb-4">
                            <SectionCandidateRecentActivities />
                        </div>
                        <div className="col-lg-12 col-md-12 mb-4">
                            <SectionCandidateRecentApplications />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CanDashboardPage;
