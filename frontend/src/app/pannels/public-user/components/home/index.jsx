import { useEffect, useState } from "react";
import { loadScript, publicUrlFor } from "../../../../../globals/constants";
import JobZImage from "../../../../common/jobz-img";
import CountUp from "react-countup";
import { publicUser } from "../../../../../globals/route-names";
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function Home1Page() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    useEffect(() => {
        loadScript("js/custom.js");

        // Fetch categories from Django API
        axios.get('http://127.0.0.1:8000/api/categories/')
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setLoading(false);
            });
        // Fetch jobs for job list section
        axios.get("http://127.0.0.1:8000/api/jobs/")
            .then(response => {
                setJobs(response.data);
                setJobsLoading(false);
            })
            .catch(error => {
                setJobs([]);
                setJobsLoading(false);
            });
        axios.get('http://127.0.0.1:8000/top-companies/')
            .then(response => {
                setCompanies(response.data);
                setCompaniesLoading(false);
            })
            .catch(error => {
                console.error('Error fetching companies:', error);
                setCompanies([]);
                setCompaniesLoading(false);
            });
    }, []);


    // Slick carousel settings for job categories
    const categorySliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };
    const companySliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        arrows: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };
    // Format utility for date difference
    function daysAgo(dateString) {
        if (!dateString) return "";
        const posted = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "1 day ago";
        return `${diff} days ago`;
    }

    return (
        <>
            {/* Custom CSS for job categories section */}
            <style>{`
                /* Slick slider overrides for categories */
                .job-categories-style1 .slick-slider {
                    position: relative;
                }
                
                .job-categories-style1 .slick-list {
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                }
                
                .job-categories-style1 .slick-track {
                    display: flex !important;
                }
                
                .job-categories-style1 .slick-slide {
                    height: auto;
                    padding: 0 15px;
                }
                
                .job-categories-style1 .slick-slide > div {
                    height: 100%;
                }
                
                /* Category block styling */
                .job-categories-style1 .item {
                    height: 100%;
                }
                
                .job-categories-style1 .job-categories-block {
                    background: #fff;
                    border-radius: 10px;
                    padding: 30px 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .job-categories-style1 .job-categories-block:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
                }
                
                .job-categories-style1 .job-categories-block .twm-media {
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    background: rgba(25, 103, 210, 0.05);
                    border-radius: 50%;
                }
                
                .job-categories-style1 .job-categories-block .twm-media i {
                    font-size: 40px;
                    color: #1967d2;
                    transition: all 0.3s ease;
                }
                
                .job-categories-style1 .job-categories-block:hover .twm-media i {
                    transform: scale(1.1);
                    color: #0d47a1;
                }
                
                .job-categories-style1 .job-categories-block .twm-content {
                    text-align: center;
                }
                
                .job-categories-style1 .job-categories-block .twm-jobs-available {
                    font-size: 14px;
                    color: #fff;
                    margin-bottom: 10px;
                    font-weight: 500;
                }
                
                .job-categories-style1 .job-categories-block .twm-content a {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                
                .job-categories-style1 .job-categories-block .twm-content a:hover {
                    color: #1967d2;
                }
                
                /* Arrow styling */
                .job-categories-style1 .slick-prev,
                .job-categories-style1 .slick-next {
                    width: 45px;
                    height: 45px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    z-index: 1;
                }
                
                .job-categories-style1 .slick-prev:hover,
                .job-categories-style1 .slick-next:hover {
                    background: #1967d2;
                }
                
                .job-categories-style1 .slick-prev:hover:before,
                .job-categories-style1 .slick-next:hover:before {
                    color: #fff;
                }
                
                .job-categories-style1 .slick-prev {
                    left: -55px;
                }
                
                .job-categories-style1 .slick-next {
                    right: -55px;
                }
                
                .job-categories-style1 .slick-prev:before,
                .job-categories-style1 .slick-next:before {
                    font-size: 24px;
                    opacity: 1;
                    color: #fff;
                }
                
                @media (max-width: 1199px) {
                    .job-categories-style1 .slick-prev {
                        left: -35px;
                    }
                    
                    .job-categories-style1 .slick-next {
                        right: -35px;
                    }
                }
                
                @media (max-width: 767px) {
                    .job-categories-style1 .slick-prev {
                        left: 0;
                    }
                    
                    .job-categories-style1 .slick-next {
                        right: 0;
                    }
                    
                    .job-categories-style1 .slick-prev,
                    .job-categories-style1 .slick-next {
                        width: 35px;
                        height: 35px;
                    }
                    
                    .job-categories-style1 .slick-prev:before,
                    .job-categories-style1 .slick-next:before {
                        font-size: 18px;
                    }
                }
            `}</style>

            {/*Banner Start*/}
            <div className="twm-home1-banner-section site-bg-gray bg-cover" style={{ backgroundImage: `url(${publicUrlFor("images/main-slider/slider1/bg1.jpg")})` }}>
                <div className="row">
                    {/*Left Section*/}
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="twm-bnr-left-section">
                            <div className="twm-bnr-title-small">We Have <span className="site-text-primary">208,000+</span> Live Jobs</div>
                            <div className="twm-bnr-title-large">Find the <span className="site-text-primary">job</span> that fits your life</div>
                            <div className="twm-bnr-discription">Type your keyword, then click search to find your perfect job.</div>
                            <div className="twm-bnr-search-bar">
                                <form>
                                    <div className="row">
                                        {/*Title*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>What</label>
                                            <select className="wt-search-bar-select selectpicker" data-live-search="true" title="" id="j-Job_Title" data-bv-field="size">
                                                <option disabled value="" >Select Category</option>
                                                <option>Job Title</option>
                                                <option>Web Designer</option>
                                                <option>Developer</option>
                                                <option>Acountant</option>
                                            </select>
                                        </div>
                                        {/*All Category*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>Type</label>
                                            <select className="wt-search-bar-select selectpicker" data-live-search="true" title="" id="j-All_Category" data-bv-field="size">
                                                <option disabled value="" >Select Category</option>
                                                <option>All Category</option>
                                                <option>Web Designer</option>
                                                <option>Developer</option>
                                                <option>Acountant</option>
                                            </select>
                                        </div>
                                        {/*Location*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>Location</label>
                                            <div className="twm-inputicon-box">
                                                <input name="username" type="text" required className="form-control" placeholder="Search..." />
                                                <i className="twm-input-icon fas fa-map-marker-alt" />
                                            </div>
                                        </div>
                                        {/*Find job btn*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <button type="button" className="site-button">Find Job</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="twm-bnr-popular-search">
                                <span className="twm-title">Popular Searches:</span>
                                <NavLink to={publicUser.jobs.LIST}>Developer</NavLink> ,
                                <NavLink to={publicUser.jobs.LIST}>Designer</NavLink> ,
                                <NavLink to={publicUser.jobs.LIST}>Architect</NavLink> ,
                                <NavLink to={publicUser.jobs.LIST}>Engineer</NavLink> ...
                            </div>
                        </div>
                    </div>
                    {/*right Section*/}
                    <div className="col-xl-6 col-lg-6 col-md-12 twm-bnr-right-section">
                        <div className="twm-bnr-right-content">
                            <div className="twm-img-bg-circle-area">
                                <div className="twm-img-bg-circle1 rotate-center"><span /></div>
                                <div className="twm-img-bg-circle2 rotate-center-reverse"><span /></div>
                                <div className="twm-img-bg-circle3"><span /></div>
                            </div>
                            <div className="twm-bnr-right-carousel">
                                <div className="owl-carousel twm-h1-bnr-carousal">
                                    <div className="item">
                                        <div className="slide-img">
                                            <JobZImage src="images/main-slider/slider1/job_banner1.png" alt="#" />
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="slide-img">
                                            <div className="slide-img">
                                                <JobZImage src="images/main-slider/slider1/job_banner2.png" alt="#" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="twm-bnr-blocks-position-wrap">
                                    {/*icon-block-1*/}
                                    <div className="twm-bnr-blocks twm-bnr-blocks-position-1">
                                        <div className="twm-icon">
                                            <JobZImage src="images/main-slider/slider1/icon-1.png" alt="" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="tw-count-number text-clr-sky">
                                                <span className="counter">
                                                    <CountUp end={12} duration={10} />
                                                </span>K+
                                            </div>
                                            <p className="icon-content-info">Companies Jobs</p>
                                        </div>
                                    </div>
                                    {/*icon-block-2*/}
                                    <div className="twm-bnr-blocks twm-bnr-blocks-position-2">
                                        <div className="twm-icon">
                                            <JobZImage src="images/main-slider/slider1/icon-2.png" alt="" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="tw-count-number text-clr-pink">
                                                <span className="counter">
                                                    <CountUp end={98} duration={10} />
                                                </span> +
                                            </div>
                                            <p className="icon-content-info">Job For Countries </p>
                                        </div>
                                    </div>
                                    {/*icon-block-3*/}
                                    <div className="twm-bnr-blocks-3 twm-bnr-blocks-position-3">
                                        <div className="twm-pics">
                                            <span><JobZImage src="images/main-slider/slider1/user/u-1.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-2.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-3.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-4.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-5.jpg" alt="" /></span>
                                            <span><JobZImage src="images/main-slider/slider1/user/u-6.jpg" alt="" /></span>
                                        </div>
                                        <div className="twm-content">
                                            <div className="tw-count-number text-clr-green">
                                                <span className="counter">
                                                    <CountUp end={3} duration={10} />
                                                </span>K+
                                            </div>
                                            <p className="icon-content-info">Jobs Done</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*Samll Ring Left*/}
                            <div className="twm-small-ring-l slide-top-animation" />
                            <div className="twm-small-ring-2 slide-top-animation" />
                        </div>
                    </div>
                </div>
                <div className="twm-gradient-text">
                    Jobs
                </div>
            </div>
            {/*Banner End*/}

            {/* HOW IT WORK SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-white twm-how-it-work-area">
                <div className="container">
                    {/* title START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Working Process</div>
                        </div>
                        <h2 className="wt-title">How It Works</h2>
                    </div>
                    {/* title END*/}
                    <div className="twm-how-it-work-section">
                        <div className="row">
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps">
                                    <span className="twm-large-number">01</span>
                                    <div className="twm-w-pro-top bg-clr-sky">
                                        <div className="twm-media">
                                            <span><JobZImage src="images/work-process/icon1.png" alt="icon1" /></span>
                                        </div>
                                        <h4 className="twm-title">Register<br />Your Account</h4>
                                    </div>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps">
                                    <span className="twm-large-number">02</span>
                                    <div className="twm-w-pro-top bg-clr-pink">
                                        <div className="twm-media">
                                            <span><JobZImage src="images/work-process/icon2.png" alt="icon1" /></span>
                                        </div>
                                        <h4 className="twm-title">Apply <br />
                                            For Dream Job</h4>
                                    </div>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps">
                                    <span className="twm-large-number">03</span>
                                    <div className="twm-w-pro-top bg-clr-green">
                                        <div className="twm-media">
                                            <span><JobZImage src="images/work-process/icon3.png" alt="icon1" /></span>
                                        </div>
                                        <h4 className="twm-title">Upload <br />Your Resume</h4>
                                    </div>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* HOW IT WORK SECTION END */}

            {/* JOBS CATEGORIES SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area">
                <div className="container">
                    <div className="wt-separator-two-part">
                        <div className="row wt-separator-two-part-row">
                            <div className="col-xl-5 col-lg-5 col-md-12 wt-separator-two-part-left">
                                <div className="section-head left wt-small-separator-outer">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Jobs by Categories</div>
                                    </div>
                                    <h2 className="wt-title">Choose Your Desire Category</h2>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-12 wt-separator-two-part-right">
                                <p>Browse through various job categories and find the perfect match for your skills and interests.</p>
                            </div>
                        </div>
                    </div>
                    <div className="twm-job-categories-section">
                        <div className="job-categories-style1 m-b30">
                            {loading ? (
                                <div className="text-center py-5">
                                    <p>Loading categories...</p>
                                </div>
                            ) : categories.length > 0 ? (
                                <Slider {...categorySliderSettings}>
                                    {categories.map((category) => (
                                        <div key={category.id} className="item">
                                            <div className="job-categories-block">
                                                <div className="twm-media">
                                                    {category.icon ? (
                                                        <i className={category.icon}></i>
                                                    ) : (
                                                        <i className="fa-solid fa-briefcase"></i>
                                                    )}
                                                </div>
                                                <div className="twm-content">
                                                    <div className="twm-jobs-available">{category.job_count} Jobs</div>
                                                    <NavLink to={publicUser.jobs.DETAIL1}>{category.name}</NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <div className="text-center py-5">
                                    <p>No categories available.</p>
                                </div>
                            )}
                        </div>
                        <div className="text-right job-categories-btn">
                            <NavLink to={publicUser.jobs.GRID} className=" site-button">All Categories</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            {/* JOBS CATEGORIES SECTION END */}

            {/* EXPLORE NEW LIFE START */}
            <div className="section-full p-t120 p-b120 twm-explore-area bg-cover " style={{ backgroundImage: `url(${publicUrlFor("images/background/bg-1.jpg")})` }}>
                <div className="container">
                    <div className="section-content">
                        <div className="row">
                            <div className="col-lg-4 col-md-12">
                                <div className="twm-explore-media-wrap">
                                    <div className="twm-media">
                                        <JobZImage src="images/gir-large.png" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-12">
                                <div className="twm-explore-content-outer">
                                    <div className="twm-explore-content">
                                        <div className="twm-l-line-1" />
                                        <div className="twm-l-line-2" />
                                        <div className="twm-r-circle-1" />
                                        <div className="twm-r-circle-2" />
                                        <div className="twm-title-small">Explore New Life</div>
                                        <div className="twm-title-large">
                                            <h2>Don't just find. be found
                                                put your CV in front of
                                                great employers </h2>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry the standard dummy text ever since the  when an printer took.</p>
                                        </div>
                                        <div className="twm-upload-file">
                                            <button type="button" className="site-button">Upload Your Resume <i className="feather-upload" /></button>
                                        </div>
                                    </div>
                                    <div className="twm-bold-circle-right" />
                                    <div className="twm-bold-circle-left" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* EXPLORE NEW LIFE END */}

            {/* TOP COMPANIES START */}
            <div className="section-full p-t120 site-bg-white twm-companies-wrap">
                {/* title START*/}
                <div className="section-head center wt-small-separator-outer">
                    <div className="wt-small-separator site-text-primary">
                        <div>Top Companies</div>
                    </div>
                    <h2 className="wt-title">Get hired in top companies</h2>
                </div>
                {/* title END*/}
                <div className="container">
                    <div className="section-content">
                        {companiesLoading ? (
                            <div className="text-center py-5">
                                <p>Loading companies...</p>
                            </div>
                        ) : companies.length > 0 ? (
                            <Slider {...companySliderSettings} className="home-client-carousel2">
                                {companies.map((company) => {
                                    const logoUrl = company.logo?.startsWith('http')
                                        ? company.logo
                                        : `http://127.0.0.1:8000${company.logo}`;

                                    return (
                                        <div key={company.id} className="item">
                                            <div style={{ padding: '0 10px' }}>
                                                <NavLink
                                                    to={company.website_url || publicUser.employer.LIST}
                                                    target={company.website_url ? "_blank" : "_self"}
                                                    rel={company.website_url ? "noopener noreferrer" : ""}
                                                    style={{
                                                        textDecoration: 'none',
                                                        display: 'block'
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '25px 15px',
                                                        minHeight: '220px',
                                                        background: '#ffffff',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e8e8e8',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                                                            e.currentTarget.style.borderColor = '#1967d2';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                                            e.currentTarget.style.borderColor = '#e8e8e8';
                                                        }}
                                                    >
                                                        {/* Logo Container - Rectangle/Square */}
                                                        <div style={{
                                                            width: '140px',
                                                            height: '100px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginBottom: '18px',
                                                            background: '#f8f9fa',
                                                            borderRadius: '8px',
                                                            padding: '15px',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {company.logo ? (
                                                                <img
                                                                    src={logoUrl}
                                                                    alt={company.name}
                                                                    onError={(e) => {
                                                                        console.error('Image failed to load:', logoUrl);
                                                                        e.target.style.display = 'none';
                                                                        e.target.parentElement.innerHTML = '<div style="color: #999; font-size: 14px; text-align: center; width: 100%;">Logo unavailable</div>';
                                                                    }}
                                                                    style={{
                                                                        maxWidth: '100%',
                                                                        maxHeight: '100%',
                                                                        width: 'auto',
                                                                        height: 'auto',
                                                                        objectFit: 'contain',
                                                                        display: 'block'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div style={{
                                                                    color: '#999',
                                                                    fontSize: '14px',
                                                                    textAlign: 'center',
                                                                    width: '100%'
                                                                }}>
                                                                    Logo unavailable
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Company Name */}
                                                        <div style={{
                                                            fontSize: '16px',
                                                            fontWeight: '300',
                                                            color: '#1d1d1d',
                                                            textAlign: 'center',
                                                            lineHeight: '1.4',
                                                            marginTop: '8px',
                                                            padding: '0 10px',
                                                            wordWrap: 'break-word',
                                                            width: '100%',
                                                            minHeight: '44px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            {company.name}
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                        ) : (
                            <div className="text-center py-5">
                                <p>No companies available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="twm-company-approch-outer">
                    <div className="twm-company-approch">
                        <div className="row">
                            {/*block 1*/}
                            <div className="col-lg-4 col-md-12">
                                <div className="counter-outer-two">
                                    <div className="icon-content">
                                        <div className="tw-count-number text-clr-sky">
                                            <span className="counter">
                                                <CountUp end={5} duration={10} />
                                            </span>M+
                                        </div>
                                        <p className="icon-content-info">Million daily active users</p>
                                    </div>
                                </div>
                            </div>
                            {/*block 2*/}
                            <div className="col-lg-4 col-md-12">
                                <div className="counter-outer-two">
                                    <div className="icon-content">
                                        <div className="tw-count-number text-clr-pink">
                                            <span className="counter">
                                                <CountUp end={9} duration={10} />
                                            </span>K+
                                        </div>
                                        <p className="icon-content-info">Open job positions</p>
                                    </div>
                                </div>
                            </div>
                            {/*block 3*/}
                            <div className="col-lg-4 col-md-12">
                                <div className="counter-outer-two">
                                    <div className="icon-content">
                                        <div className="tw-count-number text-clr-green">
                                            <span className="counter">
                                                <CountUp end={2} duration={10} />
                                            </span>M+
                                        </div>
                                        <p className="icon-content-info">Million stories shared</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TOP COMPANIES END */}


            {/* JOB POST LIST START */}
            <div className="section-full p-t120 p-b90 site-bg-light-purple twm-bg-ring-wrap">
                <div className="twm-bg-ring-right"></div>
                <div className="twm-bg-ring-left"></div>
                <div className="container">
                    {/* Section Title */}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>All Jobs Post</div>
                        </div>
                        <h2 className="wt-title">Find Your Career You Deserve it</h2>
                    </div>
                    {/* Job Listing */}
                    <div className="section-content">
                        <div className="twm-jobs-list-wrap">
                            <ul>
                                {jobsLoading ? (
                                    <div className="text-center py-5">Loading jobs...</div>
                                ) : jobs.length === 0 ? (
                                    <div className="text-center py-5">No jobs found.</div>
                                ) : (
                                    jobs.slice(0, 8).map(job => (
                                        <li key={job.id}>
                                            <div className="twm-jobs-list-style1 mb-5">
                                                <div className="twm-media">
                                                    <JobZImage
                                                        src={job.company_logo
                                                            ? `http://127.0.0.1:8000${job.company_logo}`
                                                            : "images/jobs-company/pic1.jpg"
                                                        }
                                                        alt={job.company_name || job.title}
                                                    />
                                                </div>
                                                <div className="twm-mid-content">
                                                    {/* Dynamic link - replace :id with actual job.id */}
                                                    <NavLink
                                                        to={`/job-detail/2/${job.id}`}
                                                        className="twm-job-title"
                                                    >
                                                        <h4>
                                                            {job.title}
                                                            <span className="twm-job-post-duration">
                                                                / {daysAgo(job.created_at)}
                                                            </span>
                                                        </h4>
                                                    </NavLink>
                                                    <p className="twm-job-address">
                                                        {job.complete_address || `${job.city}, ${job.country}`}
                                                    </p>
                                                </div>
                                                <div className="twm-right-content">
                                                    <div className="twm-jobs-category green">
                                                        <span className="twm-bg-green">{job.job_type_name}</span>
                                                    </div>
                                                    {job.salary_range && (
                                                        <div className="twm-jobs-amount">
                                                            ${job.salary_range} <span>/ Month</span>
                                                        </div>
                                                    )}
                                                    {/* Dynamic Browse Job button */}
                                                    <NavLink
                                                        to={`/job-detail/2/${job.id}`}
                                                        className="twm-jobs-browse site-text-primary"
                                                    >
                                                        Browse Job
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </li>
                                    )))}


                            </ul>
                            <div className="text-center m-b30">
                                <NavLink to="/jobs" className="site-button">Browse All Jobs</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* JOB POST LIST END */}

            {/* TESTIMONIAL SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-white twm-testimonial-1-area">
                <div className="container">
                    <div className="wt-separator-two-part">
                        <div className="row wt-separator-two-part-row">
                            <div className="col-xl-5 col-lg-6 col-md-12 wt-separator-two-part-left">
                                {/* title START*/}
                                <div className="section-head left wt-small-separator-outer">
                                    <div className="wt-small-separator site-text-primary">
                                        <div>Clients Testimonials</div>
                                    </div>
                                    <h2 className="wt-title">What Our Customers Say About Us</h2>
                                </div>
                                {/* title END*/}
                            </div>
                        </div>
                    </div>
                    <div className="section-content">
                        <div className="owl-carousel twm-testimonial-1-carousel owl-btn-bottom-center ">
                            {/* COLUMNS 1 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-1.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 2 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-2.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 3 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-3.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 4 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-2.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* COLUMNS 5 */}
                            <div className="item ">
                                <div className="twm-testimonial-1">
                                    <div className="twm-testimonial-1-content">
                                        <div className="twm-testi-media">
                                            <JobZImage src="images/testimonials/pic-1.png" alt="#" />
                                        </div>
                                        <div className="twm-testi-content">
                                            <div className="twm-quote">
                                                <JobZImage src="images/quote-dark.png" alt="" />
                                            </div>
                                            <div className="twm-testi-info">I just got a job that I applied for via careerfy! I used the site all the time during my job hunt.</div>
                                            <div className="twm-testi-detail">
                                                <div className="twm-testi-name">Nikola Tesla</div>
                                                <div className="twm-testi-position">Accountant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TESTIMONIAL SECTION END */}

            {/* OUR BLOG START */}
            <div className="section-full p-t120 p-b90 site-bg-gray">
                <div className="container">
                    {/* title START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Our Blogs</div>
                        </div>
                        <h2 className="wt-title">Latest Article</h2>
                    </div>
                    {/* title END*/}
                    <div className="section-content">
                        <div className="twm-blog-post-1-outer-wrap">
                            <div className="owl-carousel twm-la-home-blog owl-btn-bottom-center">
                                <div className="item">
                                    {/*Block one*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg1.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mark Petter</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>How to convince recruiters and get your dream job</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block two*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg2.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>David Wish</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>5 things to know about the March
                                                        2023 jobs report</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block three*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg3.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mike Doe</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>Job Board is the most important
                                                        sector in the world</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block Four*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg1.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mark Petter</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>How to convince recruiters and get your dream job</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block Five*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg2.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>David Wish</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>5 things to know about the March
                                                        2023 jobs report</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    {/*Block Six*/}
                                    <div className="blog-post twm-blog-post-1-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg3.jpg" alt="" /></NavLink>
                                        </div>
                                        <div className="wt-post-info">
                                            <div className="wt-post-meta ">
                                                <ul>
                                                    <li className="post-date">March 05, 2023</li>
                                                    <li className="post-author">By <NavLink to={publicUser.candidate.DETAIL1}>Mike Doe</NavLink></li>
                                                </ul>
                                            </div>
                                            <div className="wt-post-title ">
                                                <h4 className="post-title">
                                                    <NavLink to={publicUser.blog.DETAIL}>Job Board is the most important
                                                        sector in the world</NavLink>
                                                </h4>
                                            </div>
                                            <div className="wt-post-text ">
                                                <p>
                                                    New chip traps clusters of migrating tumor cells asperiortenetur, blanditiis odit.
                                                </p>
                                            </div>
                                            <div className="wt-post-readmore ">
                                                <NavLink to={publicUser.blog.DETAIL} className="site-button-link site-text-primary">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* OUR BLOG END */}
        </>
    )
}

export default Home1Page;
