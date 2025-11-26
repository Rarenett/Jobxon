import { NavLink } from "react-router-dom";
import JobZImage from "../../../../../common/jobz-img";
import { publicUser } from "../../../../../../globals/route-names";

function SectionAvailableJobsList() {
    return (
        <>
            <h4 className="twm-s-title">Available Jobs</h4>
            <div className="twm-jobs-list-wrap">
                <ul>
                    <li>
                        <div className="twm-jobs-list-style1 mb-5">
                            <div className="twm-media">
                                <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                            </div>
                            <div className="twm-mid-content">
                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                    <h4>Senior Web Designer<span className="twm-job-post-duration">/ 1 days ago</span></h4>
                                </NavLink>
                                <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                            </div>
                            <div className="twm-right-content">
                                <div className="twm-jobs-category green"><span className="twm-bg-green">New</span></div>
                                <div className="twm-jobs-amount">$1000 <span>/ Month</span></div>
                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="twm-jobs-list-style1 mb-5">
                            <div className="twm-media">
                                <JobZImage src="images/jobs-company/pic2.jpg" alt="#" />
                            </div>
                            <div className="twm-mid-content">
                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                    <h4>Senior Stock Technician<span className="twm-job-post-duration">/ 15 days ago</span></h4>
                                </NavLink>
                                <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                            </div>
                            <div className="twm-right-content">
                                <div className="twm-jobs-category green"><span className="twm-bg-brown">Intership</span></div>
                                <div className="twm-jobs-amount">$1000 <span>/ Month</span></div>
                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="twm-jobs-list-style1 mb-5">
                            <div className="twm-media">
                                <JobZImage src="images/jobs-company/pic3.jpg" alt="#" />
                            </div>
                            <div className="twm-mid-content">
                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-job-title">
                                    <h4 className="twm-job-title">IT Department Manager<span className="twm-job-post-duration">/ 6 Month ago</span></h4>
                                </NavLink>
                                <p className="twm-job-address">1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-job-websites site-text-primary">https://thewebmax.com</a>
                            </div>
                            <div className="twm-right-content">
                                <div className="twm-jobs-category green"><span className="twm-bg-purple">Fulltime</span></div>
                                <div className="twm-jobs-amount">$1000 <span>/ Month</span></div>
                                <NavLink to={publicUser.jobs.DETAIL1} className="twm-jobs-browse site-text-primary">Browse Job</NavLink>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default SectionAvailableJobsList;