import { useState, useEffect } from "react";
import JobZImage from "../../../../common/jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import SectionPagination from "../common/section-pagination";
import SectionJobsSidebar1 from "./sidebar/section-jobs-sidebar1";

import axios from 'axios';

function SectionJobsGrid() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch jobs from Django API
        axios.get('http://127.0.0.1:8000/api/jobs/')
            .then(response => {
                setJobs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
                setJobs([]);
                setLoading(false);
            });
    }, []);

    // Format date utility
    function daysAgo(dateString) {
        if (!dateString) return "";
        const posted = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "1 day ago";
        if (diff < 30) return `${diff} days ago`;
        if (diff < 60) return "1 month ago";
        return `${Math.floor(diff / 30)} months ago`;
    }

    // Map job type to badge class
    function getBadgeClass(jobType) {
        const typeMap = {
            'New': 'twm-bg-green',
            'Internship': 'twm-bg-brown',
            'Fulltime': 'twm-bg-purple',
            'Freelancer': 'twm-bg-sky',
            'Temporary': 'twm-bg-golden',
            'Part-time': 'twm-bg-blue'
        };
        return typeMap[jobType] || 'twm-bg-green';
    }

    if (loading) {
        return <div className="text-center py-5">Loading jobs...</div>;
    }

    if (jobs.length === 0) {
        return <div className="text-center py-5">No jobs available.</div>;
    }

    return (
        <>
            <div className="row">
                {jobs.map((job) => (
                    <div key={job.id} className="col-lg-6 col-md-12 m-b30">
                        <div className="twm-jobs-grid-style1">
                            <div className="twm-media">
                                <JobZImage 
                                    src={job.company_logo || "images/jobs-company/pic1.jpg"} 
                                    alt={job.company_name || job.title} 
                                />
                            </div>
                            <span className="twm-job-post-duration">
                                {daysAgo(job.created_at)}
                            </span>
                            <div className="twm-jobs-category green">
                                <span className={getBadgeClass(job.job_type_name)}>
                                    {job.job_type_name}
                                </span>
                            </div>
                            <div className="twm-mid-content">
                                <NavLink 
                                    to={`/jobs/${job.slug || job.id}`} 
                                    className="twm-job-title"
                                >
                                    <h4>{job.title}</h4>
                                </NavLink>
                                <p className="twm-job-address">
                                    {job.complete_address || 
                                     [job.city, job.country].filter(Boolean).join(', ')}
                                </p>
                                {job.company_website && (
                                    <a 
                                        href={job.company_website} 
                                        className="twm-job-websites site-text-primary"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {job.company_website}
                                    </a>
                                )}
                            </div>
                            <div className="twm-right-content">
                                <div className="twm-jobs-amount">
                                    {job.offered_salary ? (
                                        <>
                                            ${job.offered_salary} 
                                            <span>/ {job.salary_type || 'Month'}</span>
                                        </>
                                    ) : (
                                        'Negotiable'
                                    )}
                                </div>
                                <NavLink 
                                    to={`/jobs/${job.slug || job.id}`} 
                                    className="twm-jobs-browse site-text-primary"
                                >
                                    Browse Job
                                </NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <SectionPagination />
        </>
    );
}

export default SectionJobsGrid;
