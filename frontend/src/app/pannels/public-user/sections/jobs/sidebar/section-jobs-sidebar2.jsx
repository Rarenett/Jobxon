import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../../globals/route-names";
import SectionSideAdvert from "./section-side-advert";
import JobZImage from "../../../../../common/jobz-img";

function SectionJobsSidebar2({ _config, jobData, companyData }) {
    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // If no job data, show loading or placeholder
    if (!jobData) {
        return (
            <div className="side-bar mb-4">
                <div className="twm-s-info2-wrap mb-5">
                    <div className="twm-s-info2">
                        <h4 className="section-head-small mb-4">Job Information</h4>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="side-bar mb-4">
                <div className="twm-s-info2-wrap mb-5">
                    <div className="twm-s-info2">
                        <h4 className="section-head-small mb-4">Job Information</h4>
                        
                        {/* Quick Stats */}
                        <ul className="twm-job-hilites">
                            <li>
                                <i className="fas fa-calendar-alt" />
                                <span className="twm-title">Posted: {formatDate(jobData.created_at)}</span>
                            </li>
                            <li>
                                <i className="fas fa-eye" />
                                <span className="twm-title">Views: Coming Soon</span>
                            </li>
                            <li>
                                <i className="fas fa-file-signature" />
                                <span className="twm-title">Applicants: Coming Soon</span>
                            </li>
                        </ul>

                        {/* Detailed Job Information */}
                        <ul className="twm-job-hilites2">
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-calendar-alt" />
                                    <span className="twm-title">Date Posted</span>
                                    <div className="twm-s-info-discription">{formatDate(jobData.created_at)}</div>
                                </div>
                            </li>
                            
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-map-marker-alt" />
                                    <span className="twm-title">Location</span>
                                    <div className="twm-s-info-discription">
                                        {jobData.city}, {jobData.country}
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-briefcase" />
                                    <span className="twm-title">Job Type</span>
                                    <div className="twm-s-info-discription">
                                        {jobData.job_type_name || 'Not specified'}
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-laptop-house" />
                                    <span className="twm-title">Work Mode</span>
                                    <div className="twm-s-info-discription">
                                        {jobData.work_mode || 'Not specified'}
                                    </div>
                                </div>
                            </li>

                            {jobData.experience && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-clock" />
                                        <span className="twm-title">Experience</span>
                                        <div className="twm-s-info-discription">{jobData.experience}</div>
                                    </div>
                                </li>
                            )}

                            {jobData.qualification && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-graduation-cap" />
                                        <span className="twm-title">Qualification</span>
                                        <div className="twm-s-info-discription">{jobData.qualification}</div>
                                    </div>
                                </li>
                            )}

                            {jobData.gender && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-venus-mars" />
                                        <span className="twm-title">Gender</span>
                                        <div className="twm-s-info-discription">{jobData.gender}</div>
                                    </div>
                                </li>
                            )}

                            {jobData.salary_range && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-money-bill-wave" />
                                        <span className="twm-title">Offered Salary</span>
                                        <div className="twm-s-info-discription">
                                            ${jobData.salary_range} / Month
                                        </div>
                                    </div>
                                </li>
                            )}

                            {jobData.category_name && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-tags" />
                                        <span className="twm-title">Category</span>
                                        <div className="twm-s-info-discription">
                                            {jobData.category_name}
                                        </div>
                                    </div>
                                </li>
                            )}

                            {jobData.end_date && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-hourglass-end" />
                                        <span className="twm-title">Application Deadline</span>
                                        <div className="twm-s-info-discription">
                                            {formatDate(jobData.end_date)}
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Job Skills Section */}
                {jobData.skills_required && (
                    <div className="widget tw-sidebar-tags-wrap">
                        <h4 className="section-head-small mb-4">Job Skills</h4>
                        <div className="tagcloud">
                            {jobData.skills_required.split(',').map((skill, index) => (
                                <a key={index} href="#">{skill.trim()}</a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Company Information Section */}
            {_config.showJobInfo && companyData && (
                <div className="twm-s-info3-wrap mb-5">
                    <div className="twm-s-info3">
                        <div className="twm-s-info-logo-section">
                            <div className="twm-media">
                                <JobZImage 
                                    src={companyData.logo 
                                        ? `http://127.0.0.1:8000${companyData.logo}`
                                        : "images/jobs-company/pic1.jpg"
                                    } 
                                    alt={companyData.name} 
                                />
                            </div>
                            <h4 className="twm-title">{jobData.title}</h4>
                        </div>
                        <ul>
                            {companyData.name && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-building" />
                                        <span className="twm-title">Company</span>
                                        <div className="twm-s-info-discription">
                                            {companyData.name}
                                        </div>
                                    </div>
                                </li>
                            )}

                            {companyData.phone && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-mobile-alt" />
                                        <span className="twm-title">Phone</span>
                                        <div className="twm-s-info-discription">
                                            {companyData.phone}
                                        </div>
                                    </div>
                                </li>
                            )}

                            {jobData.email && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-at" />
                                        <span className="twm-title">Email</span>
                                        <div className="twm-s-info-discription">
                                            {jobData.email}
                                        </div>
                                    </div>
                                </li>
                            )}

                            {(companyData.website || jobData.website) && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-desktop" />
                                        <span className="twm-title">Website</span>
                                        <div className="twm-s-info-discription">
                                            <a 
                                                href={companyData.website || jobData.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary"
                                            >
                                                {companyData.website || jobData.website}
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            )}

                            {(companyData.location || jobData.complete_address) && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-map-marker-alt" />
                                        <span className="twm-title">Address</span>
                                        <div className="twm-s-info-discription">
                                            {companyData.address || companyData.location || jobData.complete_address}
                                        </div>
                                    </div>
                                </li>
                            )}

                            {companyData.team_size && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-users" />
                                        <span className="twm-title">Team Size</span>
                                        <div className="twm-s-info-discription">
                                            {companyData.team_size}
                                        </div>
                                    </div>
                                </li>
                            )}

                            {companyData.established_since && (
                                <li>
                                    <div className="twm-s-info-inner">
                                        <i className="fas fa-calendar-check" />
                                        <span className="twm-title">Established</span>
                                        <div className="twm-s-info-discription">
                                            Since {companyData.established_since}
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>

                        {/* View Company Profile Button */}
                        {companyData.id && (
                            <NavLink 
                                to={`/emp-detail/2/${companyData.id}`} 
                                className="site-button"
                            >
                                View Profile
                            </NavLink>
                        )}
                    </div>
                </div>
            )}

            {/* Social Links (if available) */}
            {companyData && (companyData.facebook || companyData.twitter || companyData.linkedin || companyData.instagram) && (
                <div className="twm-s-info3-wrap mb-5">
                    <div className="twm-s-info3">
                        <h4 className="section-head-small mb-4">Follow Us</h4>
                        <div className="twm-social-tags">
                            {companyData.facebook && (
                                <a 
                                    href={companyData.facebook} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary me-2 mb-2"
                                >
                                    <i className="fab fa-facebook-f"></i> Facebook
                                </a>
                            )}
                            {companyData.twitter && (
                                <a 
                                    href={companyData.twitter} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-info me-2 mb-2"
                                >
                                    <i className="fab fa-twitter"></i> Twitter
                                </a>
                            )}
                            {companyData.linkedin && (
                                <a 
                                    href={companyData.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary me-2 mb-2"
                                >
                                    <i className="fab fa-linkedin-in"></i> LinkedIn
                                </a>
                            )}
                            {companyData.instagram && (
                                <a 
                                    href={companyData.instagram} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-danger me-2 mb-2"
                                >
                                    <i className="fab fa-instagram"></i> Instagram
                                </a>
                            )}
                            {companyData.youtube && (
                                <a 
                                    href={companyData.youtube} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-danger me-2 mb-2"
                                >
                                    <i className="fab fa-youtube"></i> YouTube
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <SectionSideAdvert />
        </>
    );
}

export default SectionJobsSidebar2;
