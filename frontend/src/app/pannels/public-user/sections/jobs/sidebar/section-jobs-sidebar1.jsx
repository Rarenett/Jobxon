import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../../globals/route-names";
import SectionSideAdvert from "./section-side-advert";

function SectionJobsSidebar1() {
    return (
        <>
            <div className="side-bar">
                <div className="sidebar-elements search-bx">
                    <form>
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Category</h4>
                            <select className="wt-select-bar-large selectpicker" data-live-search="true" data-bv-field="size">
                                <option>All Category</option>
                                <option>Web Designer</option>
                                <option>Developer</option>
                                <option>Acountant</option>
                            </select>
                        </div>
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Keyword</h4>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Job title or Keyword" />
                                <button className="btn" type="button"><i className="feather-search" /></button>
                            </div>
                        </div>
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Location</h4>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search location" />
                                <button className="btn" type="button"><i className="feather-map-pin" /></button>
                            </div>
                        </div>
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Job Type</h4>
                            <ul>
                                <li>
                                    <div className=" form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">Freelance</label>
                                    </div>
                                    <span className="twm-job-type-count">09</span>
                                </li>
                                <li>
                                    <div className=" form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck2" />
                                        <label className="form-check-label" htmlFor="exampleCheck2">Full Time</label>
                                    </div>
                                    <span className="twm-job-type-count">07</span>
                                </li>
                                <li>
                                    <div className=" form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck3" />
                                        <label className="form-check-label" htmlFor="exampleCheck3">Internship</label>
                                    </div>
                                    <span className="twm-job-type-count">15</span>
                                </li>
                                <li>
                                    <div className=" form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck4" />
                                        <label className="form-check-label" htmlFor="exampleCheck4">Part Time</label>
                                    </div>
                                    <span className="twm-job-type-count">20</span>
                                </li>
                                <li>
                                    <div className=" form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck5" />
                                        <label className="form-check-label" htmlFor="exampleCheck5">Temporary</label>
                                    </div>
                                    <span className="twm-job-type-count">22</span>
                                </li>
                                <li>
                                    <div className=" form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck6" />
                                        <label className="form-check-label" htmlFor="exampleCheck6">Volunteer</label>
                                    </div>
                                    <span className="twm-job-type-count">25</span>
                                </li>
                            </ul>
                        </div>
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Date Posts</h4>
                            <ul>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="exampleradio1" />
                                        <label className="form-check-label" htmlFor="exampleradio1">Last hour</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="exampleradio2" />
                                        <label className="form-check-label" htmlFor="exampleradio2">Last 24 hours</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="exampleradio3" />
                                        <label className="form-check-label" htmlFor="exampleradio3">Last 7 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="exampleradio4" />
                                        <label className="form-check-label" htmlFor="exampleradio4">Last 14 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="exampleradio5" />
                                        <label className="form-check-label" htmlFor="exampleradio5">Last 30 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="exampleradio6" />
                                        <label className="form-check-label" htmlFor="exampleradio6">All</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Type of employment</h4>
                            <ul>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="Freelance1" />
                                        <label className="form-check-label" htmlFor="Freelance1">Freelance</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="FullTime1" />
                                        <label className="form-check-label" htmlFor="FullTime1">Full Time</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="Intership1" />
                                        <label className="form-check-label" htmlFor="Intership1">Intership</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" id="Part-Time1" />
                                        <label className="form-check-label" htmlFor="Part-Time1">Part Time</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>
                <div className="widget tw-sidebar-tags-wrap">
                    <h4 className="section-head-small mb-4">Tags</h4>
                    <div className="tagcloud">
                        <NavLink to={publicUser.jobs.LIST}>General</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Jobs </NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Payment</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Application </NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Work</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Recruiting</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Employer</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Income</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Tips</NavLink>
                    </div>
                </div>
            </div>
            <SectionSideAdvert />
        </>
    )
}

export default SectionJobsSidebar1;