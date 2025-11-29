import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../globals/route-names";
import JobZImage from "../../../common/jobz-img";
import SectionRecordsFilter from "../../public-user/sections/common/section-records-filter";
import SectionPagination from "../../public-user/sections/common/section-pagination";
import { useEffect, useState } from "react";
import { loadScript } from "../../../../globals/constants";
import { useAuth } from "../../../../contexts/AuthContext";

function CanAppliedJobsPage() {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadScript("js/custom.js");
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/applications/", {
                method: "GET",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Applications data:", data);
                setApplications(Array.isArray(data) ? data : data.results || []);
                setTotalCount(data.count || data.length || 0);
            } else {
                const errorText = await response.text();
                console.error("Failed to fetch:", response.status, errorText);
                setError("Failed to load applications");
            }
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError("An error occurred while loading applications");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'pending': { class: 'twm-bg-golden', text: 'Pending' },
            'reviewed': { class: 'twm-bg-sky', text: 'Reviewed' },
            'shortlisted': { class: 'twm-bg-purple', text: 'Shortlisted' },
            'rejected': { class: 'twm-bg-brown', text: 'Rejected' },
            'accepted': { class: 'twm-bg-green', text: 'Accepted' }
        };
        return badges[status] || badges['pending'];
    };

    const getJobTypeBadge = (jobType) => {
        const badges = {
            'fulltime': { class: 'twm-bg-purple', text: 'Full Time' },
            'parttime': { class: 'twm-bg-sky', text: 'Part Time' },
            'internship': { class: 'twm-bg-brown', text: 'Internship' },
            'freelance': { class: 'twm-bg-golden', text: 'Freelance' },
            'contract': { class: 'twm-bg-green', text: 'Contract' }
        };
        return badges[jobType?.toLowerCase()] || { class: 'twm-bg-sky', text: jobType || 'Not Specified' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return months === 1 ? "1 month ago" : `${months} months ago`;
        }
        return date.toLocaleDateString();
    };

    const _filterConfig = {
        prefix: "Applied",
        type: "jobs",
        total: totalCount.toString(),
        showRange: false,
        showingUpto: ""
    };

    if (loading) {
        return (
            <div className="twm-right-section-panel candidate-save-job site-bg-gray">
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading your applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="twm-right-section-panel candidate-save-job site-bg-gray">
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchApplications}
                        className="site-button"
                        style={{ marginTop: '20px' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="twm-right-section-panel candidate-save-job site-bg-gray">
                <SectionRecordsFilter _config={_filterConfig} />

                <div className="twm-jobs-list-wrap">
                    {applications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <h4>No Applications Yet</h4>
                            <p>You haven't applied to any jobs yet. Start exploring opportunities!</p>
                            <NavLink to={publicUser.jobs.GRID} className="site-button" style={{ marginTop: '20px' }}>
                                Browse Jobs
                            </NavLink>
                        </div>
                    ) : (
                        <ul>
                            {applications.map((app) => {
                                const statusBadge = getStatusBadge(app.status);
                                const jobTypeBadge = getJobTypeBadge(app.job_type);
                                
                                return (
                                    <li key={app.id}>
                                        <div className="twm-jobs-list-style1 mb-5">
                                            <div className="twm-media">
                                                <JobZImage 
                                                    src={app.job_company_logo || "images/jobs-company/pic1.jpg"} 
                                                    alt={app.job_company_name || "Company"} 
                                                />
                                            </div>
                                            <div className="twm-mid-content">
                                                <NavLink 
                                                    to={publicUser.jobs.DETAIL2.replace(':id', app.job)} 
                                                    className="twm-job-title"
                                                >
                                                    <h4>
                                                        {app.job_title || "Job Title Not Available"}
                                                        <span className="twm-job-post-duration">
                                                            / Applied {formatDate(app.applied_at)}
                                                        </span>
                                                    </h4>
                                                </NavLink>
                                                <p className="twm-job-address">
                                                    {app.job_location || "Location not specified"}
                                                </p>
                                                {app.job_company_name && (
                                                    <p className="twm-job-websites site-text-primary">
                                                        {app.job_company_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="twm-right-content">
                                                <div className="twm-jobs-category green">
                                                    <span className={statusBadge.class}>
                                                        {statusBadge.text}
                                                    </span>
                                                </div>
                                                {app.job_type && (
                                                    <div className="twm-jobs-category green" style={{ marginTop: '5px' }}>
                                                        <span className={jobTypeBadge.class}>
                                                            {jobTypeBadge.text}
                                                        </span>
                                                    </div>
                                                )}
                                                {app.job_salary && (
                                                    <div className="twm-jobs-amount">
                                                        ${app.job_salary} <span>/ Month</span>
                                                    </div>
                                                )}
                                                <NavLink 
                                                    to={publicUser.jobs.DETAIL2.replace(':id', app.job)} 
                                                    className="twm-jobs-browse site-text-primary"
                                                >
                                                    View Job
                                                </NavLink>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
                
                {applications.length > 0 && <SectionPagination />}
            </div>
        </>
    );
}

export default CanAppliedJobsPage;
