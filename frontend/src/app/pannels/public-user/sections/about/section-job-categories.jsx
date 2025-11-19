import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";

function SectionJobCategories() {
    return (
        <>
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area2">
                {/* title="" START*/}
                <div className="section-head center wt-small-separator-outer">
                    <div className="wt-small-separator site-text-primary">
                        <div>Jobs by Categories</div>
                    </div>
                    <h2 className="wt-title">Choose Your Desire Category</h2>
                </div>
                {/* title="" END*/}
                <div className="container">
                    <div className="twm-job-categories-section-2 m-b30">
                        <div className="job-categories-style1 m-b30">
                            <div className="row">
                                {/* COLUMNS 1 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-dashboard" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Business Development</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 2 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-project-management" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Project Management</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 3 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-note" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Content Writer</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 4 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-customer-support" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Costomer Services</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 5 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-bars" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">9,185 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Finance</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 6 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-user" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">3,205 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Marketing</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 7 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-computer" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">2,100 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Design &amp; Art</NavLink>
                                        </div>
                                    </div>
                                </div>
                                {/* COLUMNS 8 */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="job-categories-block-2 m-b30">
                                        <div className="twm-media">
                                            <div className="flaticon-coding" />
                                        </div>
                                        <div className="twm-content">
                                            <div className="twm-jobs-available">1,500 Jobs</div>
                                            <NavLink to={publicUser.jobs.DETAIL1}>Web Development</NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center job-categories-btn">
                            <NavLink to={publicUser.jobs.GRID} className="site-button">All Categories</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SectionJobCategories;