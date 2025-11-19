import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../../globals/route-names";
import SectionSideAdvert from "./section-side-advert";
import JobZImage from "../../../../../common/jobz-img";

function SectionJobsSidebar2({ _config }) {
    return (
        <>
            <div className="side-bar mb-4">
                <div className="twm-s-info2-wrap mb-5">
                    <div className="twm-s-info2">
                        <h4 className="section-head-small mb-4">Job Information</h4>
                        <ul className="twm-job-hilites">
                            <li>
                                <i className="fas fa-calendar-alt" />
                                <span className="twm-title">Date Posted</span>
                            </li>
                            <li>
                                <i className="fas fa-eye" />
                                <span className="twm-title">8160 Views</span>
                            </li>
                            <li>
                                <i className="fas fa-file-signature" />
                                <span className="twm-title">6 Applicants</span>
                            </li>
                        </ul>
                        <ul className="twm-job-hilites2">
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-calendar-alt" />
                                    <span className="twm-title">Date Posted</span>
                                    <div className="twm-s-info-discription">April 22, 2023</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-map-marker-alt" />
                                    <span className="twm-title">Location</span>
                                    <div className="twm-s-info-discription">Munchen, Germany</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-user-tie" />
                                    <span className="twm-title">Job Title</span>
                                    <div className="twm-s-info-discription">Web Developer</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-clock" />
                                    <span className="twm-title">Experience</span>
                                    <div className="twm-s-info-discription">3 Year</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-suitcase" />
                                    <span className="twm-title">Qualification</span>
                                    <div className="twm-s-info-discription">Bachelor Degree </div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-venus-mars" />
                                    <span className="twm-title">Gender</span>
                                    <div className="twm-s-info-discription">Both</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-money-bill-wave" />
                                    <span className="twm-title">Offered Salary</span>
                                    <div className="twm-s-info-discription">$2000-$2500 / Month</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="widget tw-sidebar-tags-wrap">
                    <h4 className="section-head-small mb-4">Job Skills</h4>
                    <div className="tagcloud">
                        <a href="#">Html</a>
                        <a href="#">Python</a>
                        <a href="#">WordPress</a>
                        <a href="#">JavaScript</a>
                        <a href="#">Figma</a>
                        <a href="#">Angular</a>
                        <a href="#">Reactjs</a>
                        <a href="#">Drupal</a>
                        <a href="#">Joomla</a>
                    </div>
                </div>
            </div>

            {
                _config.showJobInfo &&
                <div className="twm-s-info3-wrap mb-5">
                    <div className="twm-s-info3">
                        <div className="twm-s-info-logo-section">
                            <div className="twm-media">
                                <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                            </div>
                            <h4 className="twm-title">Senior Web Designer , Developer</h4>
                        </div>
                        <ul>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-building" />
                                    <span className="twm-title">Company</span>
                                    <div className="twm-s-info-discription">Software Development</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-mobile-alt" />
                                    <span className="twm-title">Phone</span>
                                    <div className="twm-s-info-discription">+291  560 56456</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-at" />
                                    <span className="twm-title">Email</span>
                                    <div className="twm-s-info-discription">thewebmaxdemo@gmail.com</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-desktop" />
                                    <span className="twm-title">Website</span>
                                    <div className="twm-s-info-discription">https://themeforest.net</div>
                                </div>
                            </li>
                            <li>
                                <div className="twm-s-info-inner">
                                    <i className="fas fa-map-marker-alt" />
                                    <span className="twm-title">Address</span>
                                    <div className="twm-s-info-discription">1363-1385 Sunset Blvd Angeles, CA
                                        90026 ,USA</div>
                                </div>
                            </li>
                        </ul>
                        <NavLink to={publicUser.pages.ABOUT} className=" site-button">Vew Profile</NavLink>
                    </div>
                </div>
            }
            
            <SectionSideAdvert />
        </>
    )
}

export default SectionJobsSidebar2;