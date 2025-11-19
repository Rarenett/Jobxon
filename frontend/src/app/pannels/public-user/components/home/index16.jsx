import JobZImage from "../../../../common/jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import CountUp from "react-countup";
import { useEffect } from "react";
import { loadScript, updateSkinStyle } from "../../../../../globals/constants";

function Home16Page() {

    useEffect(() => {
        updateSkinStyle("8", false, false)
        loadScript("js/custom.js")
    })

    return (
        <>
            <div className="twm-home16-banner-section site-bg-light-purple">
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
                                                <option disabled value="">Select Category</option>
                                                <option selected>Job Title</option>
                                                <option>Web Designer</option>
                                                <option>Developer</option>
                                                <option>Acountant</option>
                                            </select>
                                        </div>
                                        {/*All Category*/}
                                        <div className="form-group col-xl-3 col-lg-6 col-md-6">
                                            <label>Type</label>
                                            <select className="wt-search-bar-select selectpicker" data-live-search="true" title="" id="j-All_Category" data-bv-field="size">
                                                <option disabled value="">Select Category</option>
                                                <option selected>All Category</option>
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
                    <div className="col-xl-6 col-lg-6 col-md-12">
                        <div className="twm-h-page-16-bnr-right-section">
                            <div className="twm-h-page16-bnr-pic">
                                <JobZImage src="images/home-16/banner/bnr-pic.png" alt="#" />
                            </div>
                            {/*Samll Ring Left*/}
                            <div className="twm-small-ring-l bounce" />
                            <div className="twm-small-ring-2 bounce2" />
                            <div className="twm-bnr-right-carousel">
                                <div className="twm-bnr-blocks-position-wrap">
                                    {/*icon-block-1*/}
                                    <div className="twm-bnr-blocks twm-bnr-blocks-position-1">
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
                        </div>
                    </div>
                </div>
                <div className="twm-img-bg-circle-area">
                    <div className="twm-img-bg-circle1"><span /></div>
                    <div className="twm-img-bg-circle2"><span /></div>
                    <div className="twm-img-bg-circle3"><span /></div>
                </div>
            </div>
            {/* JOBS CATEGORIES SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-white twm-job-categories-hpage-6-area">
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer">
                    <div className="wt-small-separator site-text-primary">
                        <div>Jobs by Categories</div>
                    </div>
                    <h2 className="wt-title">Choose Your Desire Category</h2>
                </div>
                {/* title="" END*/}
                <div className="container">
                    <div className="twm-job-cat-hpage-6-wrap">
                        <div className="job-cat-block-hpage-6-section m-b30">
                            <div className="row">
                                {/* COLUMNS 1 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-dashboard" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Programming &amp; Tech</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 2 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-project-management" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Content Writer</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 3 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-note" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Graphic Designer</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 4 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-customer-support" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Health &amp; Fitness</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 5 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-bars" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Digital Marketing</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 6 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-user" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Sports &amp; Media</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 7 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-computer" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Video Editing</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 8 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-coding" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Education</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 9 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-computer" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Finance &amp; Account</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 10 */}
                                <div className="col">
                                    <div className="job-cat-block-hpage-6 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-coding" />
                                        </div>
                                        <div className="twm-content">
                                            <NavLink to={publicUser.jobs.DETAIL1}>Art &amp; Design</NavLink>
                                            <div className="twm-jobs-available"><span>100+</span> Posted new jobs</div>
                                            <div className="circle-line-wrap">
                                                <NavLink to={publicUser.jobs.DETAIL2} className="circle-line-btn"><i className="fa fa-arrow-right" /></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center job-categories-btn">
                            <NavLink to={publicUser.jobs.LIST} className=" site-button">All Categories</NavLink>
                        </div>
                    </div>
                </div>
            </div>
            {/* JOBS CATEGORIES SECTION END */}
            {/* HOW IT WORK SECTION START */}
            <div className="section-full p-t120 p-b90 site-bg-gray twm-how-it-work-area">
                <div className="container">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Working Process</div>
                        </div>
                        <h2 className="wt-title">How It Works</h2>
                    </div>
                    {/* title="" END*/}
                    <div className="twm-how-it-work-section3">
                        <div className="row">
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps3">
                                    <div className="twm-w-pro-top">
                                        <span className="twm-large-number  text-clr-sky">01</span>
                                        <div className="twm-media bg-clr-sky">
                                            <span><JobZImage src="images/work-process/icon1.png" alt="icon1" /></span>
                                        </div>
                                    </div>
                                    <h4 className="twm-title">Register Your Account</h4>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps3">
                                    <div className="twm-w-pro-top">
                                        <span className="twm-large-number text-clr-pink">02</span>
                                        <div className="twm-media bg-clr-pink">
                                            <span><JobZImage src="images/work-process/icon2.png" alt="icon1" /></span>
                                        </div>
                                    </div>
                                    <h4 className="twm-title">Apply For Dream Job</h4>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6">
                                <div className="twm-w-process-steps3">
                                    <div className="twm-w-pro-top">
                                        <span className="twm-large-number  text-clr-green">03</span>
                                        <div className="twm-media  bg-clr-green">
                                            <span><JobZImage src="images/work-process/icon3.png" alt="icon1" /></span>
                                        </div>
                                    </div>
                                    <h4 className="twm-title">Upload Your Resume</h4>
                                    <p>You need to create an account to find the best and preferred job.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* HOW IT WORK SECTION END */}
            {/* Recruiters START */}
            <div className="section-full p-t120 p-b90 site-bg-white">
                <div className="container">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Top Recruiters</div>
                        </div>
                        <h2 className="wt-title">Discover your next
                            career move</h2>
                    </div>
                    {/* title="" END*/}
                    <div className="section-content">
                        <div className="twm-recruiters5-wrap">
                            <div className="twm-column-5 m-b30">
                                <ul>
                                    {/*1*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/1.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>LinkedIn</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*2*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/2.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Apple Inc.</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*3*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/3.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Saudi Aramco</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*4*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/4.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Alphabet Inc.</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*5*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/5.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Amazon.com Inc.</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*6*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/6.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Tesla Inc.</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*7*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/7.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>NVIDIA Corp.</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*8*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/8.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Hathaway Inc.</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*9*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/9.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>NVIDIA  Corp</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*10*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/10.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Meta Platforms</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*11*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/11.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Youtube</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*12*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/12.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Instagram</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*13*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/13.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>McKesson</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*14*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/14.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Foxconn</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                    {/*15*/}
                                    <li>
                                        <div className="twm-recruiters5-box">
                                            <div className="twm-rec-top">
                                                <div className="twm-rec-media">
                                                    <JobZImage src="images/home-5/recruiters/15.jpg" alt="#" />
                                                </div>
                                                <div className="twm-rec-jobs">25 Jobs</div>
                                            </div>
                                            <div className="twm-rec-content">
                                                <h4 className="twm-title"><NavLink to={publicUser.jobs.LIST}>Microsoft</NavLink></h4>
                                                <div className="twm-rec-rating-wrap">
                                                    <div className="twm-rec-rating">
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                        <span><i className="fa fa-star" /></span>
                                                    </div>
                                                    <div className="twm-rec-rating-count">(68)</div>
                                                </div>
                                                <div className="twm-job-address"><i className="feather-map-pin" />New York, US</div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center m-b30">
                                <NavLink to={publicUser.jobs.LIST} className=" site-button">View All</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Recruiters END */}
            {/* TOP COMPANIES START */}
            <div className="section-full p-t120 p-b90 site-bg-gray twm-companies-wrap">
                <div className="container">
                    <div className="section-content">
                        <div className="owl-carousel home-client-carousel4 owl-btn-vertical-center">
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w1.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w2.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w3.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w4.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w5.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w6.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w1.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w2.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w3.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="ow-client-logo">
                                    <div className="client-logo client-logo-media">
                                        <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w5.png" alt="" /></NavLink></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TOP COMPANIES END */}
            {/* EXPLORE NEW LIFE START */}
            <div className="section-full site-bg-light-purple twm-for-employee-4">
                <div className="container">
                    <div className="section-content">
                        <div className="twm-for-employee-content">
                            <div className="row">
                                <div className="col-xl-5 col-lg-12 col-md-12">
                                    <div className="twm-explore-content-outer2">
                                        <div className="twm-explore-top-section">
                                            {/* title="" START*/}
                                            <div className="section-head left wt-small-separator-outer">
                                                <div className="wt-small-separator site-text-primary">
                                                    <div>About </div>
                                                </div>
                                                <h2>We help you connect with the organizer</h2>
                                                <p>Get paid easily and security. Use our resources to become independent and showcase your professional skills.</p>
                                            </div>
                                            {/* title="" END*/}
                                            <div className="twm-read-more">
                                                <NavLink to={publicUser.pages.ABOUT} className="site-button">Read More</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-7 col-lg-12 col-md-12">
                                    <div className="twm-explore-right-section">
                                        <div className="twm-media">
                                            <div className="twm-bg-circle"><JobZImage src="images/home-4/bg-circle.png" alt="" /></div>
                                            <div className="twm-employee-pic"><JobZImage src="images/home-4/employee.png" alt="" /></div>
                                            <div className="twm-shot-pic1  anm" data-speed-x={-4} data-speed-scale={-25}><JobZImage src="images/home-4/sq-1.png" alt="" /></div>
                                            <div className="twm-shot-pic2 anm" data-wow-delay="1000ms" data-speed-x={2} data-speed-y={2}><JobZImage src="images/home-4/triangle.png" alt="" /></div>
                                            <div className="twm-shot-pic3  anm" data-speed-x={-4} data-speed-scale={-25}><JobZImage src="images/home-4/circle.png" alt="" /></div>
                                        </div>
                                        {/*block 1*/}
                                        <div className="counter-outer-two one anm" data-speed-y={-2} data-speed-scale={15} data-speed-opacity={1}>
                                            <div className="icon-content">
                                                <div className="tw-count-number text-clr-yellow-2">
                                                    <span className="counter">
                                                        <CountUp end={5} duration={10} />
                                                    </span>M+</div>
                                                <p className="icon-content-info">Million daily active users</p>
                                            </div>
                                        </div>
                                        {/*block 2*/}
                                        <div className="counter-outer-two two anm" data-speed-y={2} data-speed-scale={15} data-speed-opacity={5}>
                                            <div className="icon-content">
                                                <div className="tw-count-number text-clr-green">
                                                    <span className="counter">
                                                        <CountUp end={9} duration={10} />
                                                    </span>K+</div>
                                                <p className="icon-content-info">Open job positions</p>
                                            </div>
                                        </div>
                                        {/*block 3*/}
                                        <div className="counter-outer-two three anm" data-speed-x={-4} data-speed-scale={-25}>
                                            <div className="icon-content">
                                                <div className="tw-count-number text-clr-pink">
                                                    <span className="counter">
                                                        <CountUp end={2} duration={10} />
                                                    </span>M+</div>
                                                <p className="icon-content-info">Million stories shared</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* EXPLORE NEW LIFE END */}
            {/* TOP COMPANIES START */}
            <div className="section-full p-t120 p-b0 site-bg-white twm-companies-wrap twm-companies-wrap-h-page-7 pos-relative">
                <div className="twm-companies-wrap-bg-block" />
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer content-white">
                    <div className="wt-small-separator site-text-primary">
                        <div>Top Companies</div>
                    </div>
                    <h2 className="wt-title">Get hired in top companies</h2>
                </div>
                {/* title="" END*/}
                <div className="container ">
                    <div className="twm-companies-h-page-7">
                        <div className="section-content">
                            <div className="owl-carousel home-client-carousel3 owl-btn-vertical-center">
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w1.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w2.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w3.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w4.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w5.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w6.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w1.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w2.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w3.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ow-client-logo">
                                        <div className="client-logo client-logo-media">
                                            <NavLink to={publicUser.employer.LIST}><JobZImage src="images/client-logo2/w5.png" alt="" /></NavLink></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="twm-company-approch2-outer">
                            <div className="twm-company-approch2">
                                <div className="row">
                                    {/*block 1*/}
                                    <div className="col-lg-4 col-md-4">
                                        <div className="counter-outer-two">
                                            <div className="icon-content">
                                                <div className="tw-count-number site-text-primary">
                                                    <span className="counter">
                                                        <CountUp end={5} duration={10} />
                                                    </span>M+</div>
                                                <p className="icon-content-info">Million daily active users</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/*block 2*/}
                                    <div className="col-lg-4 col-md-4">
                                        <div className="counter-outer-two">
                                            <div className="icon-content">
                                                <div className="tw-count-number site-text-primary">
                                                    <span className="counter">
                                                        <CountUp end={9} duration={10} />
                                                    </span>K+</div>
                                                <p className="icon-content-info">Open job positions</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/*block 3*/}
                                    <div className="col-lg-4 col-md-4">
                                        <div className="counter-outer-two">
                                            <div className="icon-content">
                                                <div className="tw-count-number site-text-primary">
                                                    <span className="counter">
                                                        <CountUp end={2} duration={10} />
                                                    </span>M+</div>
                                                <p className="icon-content-info">Million stories shared</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* TOP COMPANIES END */}
            {/* OUR BLOG START */}
            <div className="section-full p-t120 p-b90 site-bg-white">
                <div className="container">
                    {/* title="" START*/}
                    <div className="section-head center wt-small-separator-outer">
                        <div className="wt-small-separator site-text-primary">
                            <div>Our Blogs</div>
                        </div>
                        <h2 className="wt-title">Latest Article</h2>
                    </div>
                    {/* title="" END*/}
                    <div className="section-content">
                        <div className="twm-blog-post-3-outer-wrap">
                            <div className="row d-flex justify-content-center">
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    {/*Block one*/}
                                    <div className="blog-post twm-blog-post-3-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg10.jpg" alt="" /></NavLink>
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
                                                    <NavLink to={publicUser.blog.DETAIL}>How to convince recruiters.</NavLink>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    {/*Block two*/}
                                    <div className="blog-post twm-blog-post-3-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg11.jpg" alt="" /></NavLink>
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
                                                    <NavLink to={publicUser.blog.DETAIL}>5 things to know about the March.</NavLink>
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12">
                                    {/*Block three*/}
                                    <div className="blog-post twm-blog-post-3-outer">
                                        <div className="wt-post-media">
                                            <NavLink to={publicUser.blog.DETAIL}><JobZImage src="images/blog/latest/bg12.jpg" alt="" /></NavLink>
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
                                                    <NavLink to={publicUser.blog.DETAIL}>Job Board is the most important</NavLink>
                                                </h4>
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

export default Home16Page;