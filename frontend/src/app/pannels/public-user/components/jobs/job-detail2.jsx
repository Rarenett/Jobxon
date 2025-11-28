import { useParams, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import JobZImage from "../../../../common/jobz-img";
import SectionJobsSidebar2 from "../../sections/jobs/sidebar/section-jobs-sidebar2";
import SectionRelatedJobs from "../../sections/jobs/detail/section-related-jobs";
import SectionShareProfile from "../../sections/common/section-share-profile";
import SectionJobLocation from "../../sections/jobs/detail/section-job-location";
import SectionOfficePhotos2 from "../../sections/common/section-office-photos2";
import SectionOfficeVideo2 from "../../sections/common/section-office-video2";
import { loadScript } from "../../../../../globals/constants";
import ApplyJobPopup from "../../../../common/popups/popup-apply-job";


function JobDetail2Page() {
    // Change slug to id
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Read More functionality
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showFullJobDescription, setShowFullJobDescription] = useState(false);

    const sidebarConfig = {
        showJobInfo: true
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                // Change slug to id in the API URL
                const jobResponse = await fetch(`http://127.0.0.1:8000/api/jobs/${id}/`);
                if (!jobResponse.ok) throw new Error('Job not found');
                const jobData = await jobResponse.json();
                setJob(jobData);

                // Fetch company details if company exists
                if (jobData.company) {
                    const companyResponse = await fetch(`http://127.0.0.1:8000/api/companies/${jobData.company}/`);
                    if (companyResponse.ok) {
                        const companyData = await companyResponse.json();
                        setCompany(companyData);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // Change slug to id
        if (id) {
            fetchJobDetails();
        }
    }, [id]); // Change dependency from slug to id

    useEffect(() => {
        loadScript("js/custom.js");
    }, []);

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Helper function to calculate days ago
    const getDaysAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    };

    // Helper function to truncate text
    const truncateText = (text, maxLength = 300) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="section-full p-t120 p-b90 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="section-full p-t120 p-b90 text-center">
                <h3>Error: {error}</h3>
                <NavLink to="/" className="site-button mt-3">Back to Home</NavLink>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="section-full p-t120 p-b90 text-center">
                <h3>Job not found</h3>
                <NavLink to="/" className="site-button mt-3">Back to Home</NavLink>
            </div>
        );
    }

    // Get company description
    const companyDescription = company?.about || company?.description || '';
    const shouldShowReadMore = companyDescription.length > 300;

    // Get job description
    const jobDescription = job.description || '';
    const shouldShowJobReadMore = jobDescription.length > 400;

    return (
        <>
            {/* Job Detail V.2 START */}
            <div className="section-full p-t50 p-b90 bg-white">
                <div className="container">
                    <div className="section-content">
                        <div className="twm-job-self-wrap twm-job-detail-v2">
                            <div className="twm-job-self-info">
                                <div className="twm-job-self-top">
                                    <div className="twm-media-bg">
                                        <JobZImage
                                            src={company?.banner_image
                                                ? `http://127.0.0.1:8000${company.banner_image}`
                                                : "images/job-detail-bg-2.jpg"
                                            }
                                            alt={job.title}
                                        />
                                        <div className="twm-jobs-category green">
                                            <span className="twm-bg-green">{job.work_mode}</span>
                                        </div>
                                        <div className="twm-job-self-bottom">
                                            <a
                                                className="site-button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#apply_job_popup"
                                                role="button"
                                            >
                                                Apply Now
                                            </a>

                                        </div>
                                    </div>
                                    <div className="twm-mid-content">
                                        <div className="twm-media">
                                            <JobZImage
                                                src={company?.logo
                                                    ? `http://127.0.0.1:8000${company.logo}`
                                                    : "images/jobs-company/pic1.jpg"
                                                }
                                                alt={job.company_name}
                                            />
                                        </div>
                                        <h4 className="twm-job-title">
                                            {job.title}
                                            <span className="twm-job-post-duration">/ {getDaysAgo(job.created_at)}</span>
                                        </h4>
                                        <p className="twm-job-address">
                                            <i className="feather-map-pin" />
                                            {job.complete_address || `${job.city}, ${job.country}`}
                                        </p>
                                        <div className="twm-job-self-mid">
                                            <div className="twm-job-self-mid-left">
                                                {job.website && (
                                                    <a href={job.website} className="twm-job-websites site-text-primary" target="_blank" rel="noopener noreferrer">
                                                        {job.website}
                                                    </a>
                                                )}
                                                {job.salary_range && (
                                                    <div className="twm-jobs-amount">
                                                        ${job.salary_range} <span>/ Month</span>
                                                    </div>
                                                )}
                                            </div>
                                            {job.end_date && (
                                                <div className="twm-job-apllication-area">
                                                    Application ends:
                                                    <span className="twm-job-apllication-date">{formatDate(job.end_date)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="twm-job-detail-2-wrap">
                            <div className="row d-flex justify-content-center">
                                <div className="col-lg-4 col-md-12 rightSidebar">
                                    <SectionJobsSidebar2 _config={sidebarConfig} jobData={job} companyData={company} />
                                </div>
                                <div className="col-lg-8 col-md-12">
                                    <div className="cabdidate-de-info">
                                        {/* Company Description with Read More */}
                                        {companyDescription && (
                                            <>
                                                <h4 className="twm-s-title m-t0">Company Description:</h4>
                                                <p style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                                    {showFullDescription
                                                        ? companyDescription
                                                        : truncateText(companyDescription, 300)
                                                    }
                                                </p>
                                                {shouldShowReadMore && (
                                                    <button
                                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                                        className="site-button-link site-text-primary"
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '0',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            marginTop: '10px',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {showFullDescription ? '← Read Less' : 'Read More →'}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* Job Overview with Read More */}
                                        {jobDescription && (
                                            <>
                                                <h4 className="twm-s-title" style={{ marginTop: '30px' }}>Job Overview</h4>
                                                <p style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                                    {showFullJobDescription
                                                        ? jobDescription
                                                        : truncateText(jobDescription, 400)
                                                    }
                                                </p>
                                                {shouldShowJobReadMore && (
                                                    <button
                                                        onClick={() => setShowFullJobDescription(!showFullJobDescription)}
                                                        className="site-button-link site-text-primary"
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: '0',
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            marginTop: '10px',
                                                            display: 'inline-block'
                                                        }}
                                                    >
                                                        {showFullJobDescription ? '← Read Less' : 'Read More →'}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {job.requirements && (
                                            <>
                                                <h4 className="twm-s-title" style={{ marginTop: '30px' }}>Requirements:</h4>
                                                <ul className="description-list-2">
                                                    {job.requirements.split('\n').filter(req => req.trim()).map((req, index) => (
                                                        <li key={index}>
                                                            <i className="feather-check" />
                                                            {req.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        {job.responsibilities && (
                                            <>
                                                <h4 className="twm-s-title" style={{ marginTop: '30px' }}>Responsibilities:</h4>
                                                <ul className="description-list-2">
                                                    {job.responsibilities.split('\n').filter(resp => resp.trim()).map((resp, index) => (
                                                        <li key={index}>
                                                            <i className="feather-check" />
                                                            {resp.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        <SectionShareProfile />
                                        <SectionJobLocation jobData={job} />
                                        {company && <SectionOfficePhotos2 companyData={company} />}
                                        {company && <SectionOfficeVideo2 companyData={company} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Job Detail V.2 END */}

            {/* Related Jobs START */}
            <div className="section-full p-t120 p-b90 site-bg-light-purple twm-related-jobs-carousel-wrap">
                <SectionRelatedJobs categoryId={job.category} currentJobId={job.id} />
            </div>
            {/* Related Jobs END */}

            <ApplyJobPopup jobId={job.id} jobTitle={job.title} />
        </>
    );
}

export default JobDetail2Page;
