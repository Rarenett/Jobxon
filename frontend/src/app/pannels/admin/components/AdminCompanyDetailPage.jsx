import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionEmployerAdminInfo from "../../admin/sections/employers/detail/section-emp-info";
import SectionEmployersCandidateSidebarAdmin from "../../admin/sections/common/section-emp-can-sidebar";
import SectionOfficeVideo1Admin from "../../admin/sections/common/section-office-video1";
import SectionOfficePhotos3Admin from "../../admin/sections/common/section-office-photos3";
import SectionAvailableJobsGrid from "../../public-user/sections/employers/detail/section-available-jobs-grid";
import { loadScript } from "../../../../globals/constants";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AdminCompanyDetailPage() {
    const { id } = useParams(); // Get company ID from URL
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadScript("js/custom.js");
    }, []);

    useEffect(() => {
        if (id) {
            fetchCompanyDetail();
        }
    }, [id]);

    const fetchCompanyDetail = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/companies/${id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCompany(data);
            } else {
                console.error('Failed to load company details');
            }
        } catch (error) {
            console.error('Error fetching company:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_URL}${imagePath}`;
    };

    if (loading) {
        return (
            <>
                {/* Admin Breadcrumb */}
                <div className="wt-admin-right-page-header clearfix">
                    <h2>Company Details</h2>
                    <div className="breadcrumbs">
                        <a href="/admin/dashboard">Home</a>
                        <a href="/admin/dashboard">Dashboard</a>
                        <a href="/admin/company-list">Companies</a>
                        <span>Loading...</span>
                    </div>
                </div>

                <div className="section-full p-t120 p-b90">
                    <div className="container">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-3">Loading company details...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!company) {
        return (
            <>
                {/* Admin Breadcrumb */}
                <div className="wt-admin-right-page-header clearfix">
                    <h2>Company Details</h2>
                    <div className="breadcrumbs">
                        <a href="/admin/dashboard">Home</a>
                        <a href="/admin/dashboard">Dashboard</a>
                        <a href="/admin/company-list">Companies</a>
                        <span>Not Found</span>
                    </div>
                </div>

                <div className="section-full p-t120 p-b90">
                    <div className="container">
                        <div className="text-center">
                            <h3>Company not found</h3>
                            <a href="/admin/company-list" className="btn btn-primary mt-3">
                                Back to Companies
                            </a>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Admin Breadcrumb Header */}
            <div className="wt-admin-right-page-header clearfix">
                <h2>Company Details</h2>
                <div className="breadcrumbs">
                    <a href="/admin/dashboard">Home</a>
                    <a href="/admin/dashboard">Dashboard</a>
                    <a href="/admin/company-list">Companies</a>
                    <span>{company.name}</span>
                </div>
            </div>

            <div className="section-full p-t0 p-b90 bg-white">
                {/*Top Wide banner Start*/}
                <SectionEmployerAdminInfo company={company} getImageUrl={getImageUrl} />
                {/*Top Wide banner End*/}
                
                <div className="container">
                    <div className="section-content">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-4 col-md-12 rightSidebar">
                                <SectionEmployersCandidateSidebarAdmin 
                                    type="2" 
                                    company={company}
                                    getImageUrl={getImageUrl}
                                />
                            </div>
                            
                            <div className="col-lg-8 col-md-12">
                                {/* Company detail START */}
                                <div className="cabdidate-de-info">
                                    <h4 className="twm-s-title m-t0">About Company</h4>
                                    
                                    {company.description ? (
                                        <p style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                            {company.description}
                                        </p>
                                    ) : (
                                        <>
                                            <p>Welcome to {company.name}! We are committed to excellence and innovation in our industry.</p>
                                            <p>Our team is dedicated to providing the best services and creating a positive impact in the market.</p>
                                        </>
                                    )}

                                    {/* Company Details */}
                                    <div className="twm-company-detail-section">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <div className="twm-company-info-item">
                                                    <div className="twm-company-info-icon">
                                                        <i className="fas fa-users" />
                                                    </div>
                                                    <div className="twm-company-info-detail">
                                                        <span className="twm-company-info-title">Team Size</span>
                                                        <span className="twm-company-info-value">
                                                            {company.team_size || 'Not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-6 mb-3">
                                                <div className="twm-company-info-item">
                                                    <div className="twm-company-info-icon">
                                                        <i className="fas fa-calendar" />
                                                    </div>
                                                    <div className="twm-company-info-detail">
                                                        <span className="twm-company-info-title">Established</span>
                                                        <span className="twm-company-info-value">
                                                            {company.established_since || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="twm-company-info-item">
                                                    <div className="twm-company-info-icon">
                                                        <i className="fas fa-map-marker-alt" />
                                                    </div>
                                                    <div className="twm-company-info-detail">
                                                        <span className="twm-company-info-title">Location</span>
                                                        <span className="twm-company-info-value">
                                                            {company.location || 'Not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="twm-company-info-item">
                                                    <div className="twm-company-info-icon">
                                                        <i className="fas fa-globe" />
                                                    </div>
                                                    <div className="twm-company-info-detail">
                                                        <span className="twm-company-info-title">Website</span>
                                                        <span className="twm-company-info-value">
                                                            {company.website ? (
                                                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                                                    Visit Website
                                                                </a>
                                                            ) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Photos and Video Section */}
                                    <div className="twm-two-part-section">
                                        <div className="row">
                                            {company.video && (
                                                <div className="col-lg-12 col-md-12 m-b30">
                                                    <h4 className="twm-s-title">Company Video</h4>
                                                    <SectionOfficeVideo1Admin videoUrl={company.video} />
                                                </div>
                                            )}
                                            
                                            {company.photos && company.photos.length > 0 && (
                                                <div className="col-lg-12 col-md-12">
                                                    <h4 className="twm-s-title">Office Photos</h4>
                                                    <div className="twm-office-gallery">
                                                        <div className="row">
                                                            {company.photos.map((photo, index) => {
                                                                const imagePath = typeof photo === 'string' 
                                                                    ? photo 
                                                                    : (photo.image || photo.photo || photo.url || '');
                                                                
                                                                return imagePath ? (
                                                                    <div className="col-lg-4 col-md-6 col-sm-6 m-b30" key={photo.id || index}>
                                                                        <div className="twm-office-gallery-pic">
                                                                            <a 
                                                                                href={getImageUrl(imagePath)} 
                                                                                className="mfp-link"
                                                                                data-fancybox="gallery"
                                                                            >
                                                                                <img 
                                                                                    src={getImageUrl(imagePath)}
                                                                                    alt={`${company.name} office ${index + 1}`}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        height: '200px',
                                                                                        objectFit: 'cover',
                                                                                        borderRadius: '8px'
                                                                                    }}
                                                                                    onError={(e) => {
                                                                                        e.target.parentElement.parentElement.style.display = 'none';
                                                                                    }}
                                                                                />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Available Jobs Section */}
                                    <SectionAvailableJobsGrid companyId={company.id} companyName={company.name} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCompanyDetailPage;
