import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionEmployerAdminInfo from "../../admin/sections/employers/detail/section-emp-info";
import SectionEmployersCandidateSidebarAdmin from "../../admin/sections/common/section-emp-can-sidebar";
import SectionOfficeVideo1Admin from "../../admin/sections/common/section-office-video1";
import SectionAvailableJobsGrid from "../../public-user/sections/employers/detail/section-available-jobs-grid";
import { loadScript } from "../../../../globals/constants";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function AdminCompanyDetailPage() {
    const { id } = useParams();
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
                <div className="wt-admin-right-page-header clearfix">
                    <h2>Company Details</h2>
                    <div className="breadcrumbs">
                        <a href="/admin/dashboard">Home</a>
                        <a href="/admin/dashboard">Dashboard</a>
                        <a href="/admin/companies">Companies</a>
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
                            <a href="/admin/companies" className="btn btn-primary mt-3">
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
                <SectionEmployerAdminInfo />
                
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
                                <div className="cabdidate-de-info">
                                    {/* About Company */}
                                    <h4 className="twm-s-title m-t0">About Company</h4>
                                    {company.about ? (
                                        <p style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                            {company.about}
                                        </p>
                                    ) : (
                                        <p>No information available about this company.</p>
                                    )}

                                    {/* Responsibilities */}
                                    {company.responsibilities && (
                                        <>
                                            <h4 className="twm-s-title">Responsibilities</h4>
                                            <p style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                                                {company.responsibilities}
                                            </p>
                                        </>
                                    )}

                                    {/* Videos Section */}
                                    {(company.video || (company.youtube_links && company.youtube_links.length > 0) || (company.vimeo_links && company.vimeo_links.length > 0)) && (
                                        <SectionOfficeVideo1Admin company={company} />
                                    )}

                                    {/* Photos */}
                                    {company.photos && company.photos.length > 0 && (
                                        <>
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
                                        </>
                                    )}

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
