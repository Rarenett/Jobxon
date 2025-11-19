import JobZImage from "../../../common/jobz-img";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript, setMenuActive } from "../../../../globals/constants";
import { employer, empRoute, publicUser } from "../../../../globals/route-names";
import { useEffect } from "react";

function EmpSidebarSection(props) {
    const currentpath = useLocation().pathname;

    useEffect(() => {
        loadScript("js/custom.js");
        loadScript("js/emp-sidebar.js");
    })

    return (
        <>
            <nav id="sidebar-admin-wraper" className={props.sidebarActive ? "" : "active"}>
                <div className="page-logo">
                    <NavLink to={publicUser.HOME1}><JobZImage id="skin_page_logo" src="images/logo-dark.png" alt="" /></NavLink>
                </div>
                <div className="admin-nav scrollbar-macosx">
                    <ul>
                        <li
                            className={setMenuActive(currentpath, empRoute(employer.DASHBOARD))}>
                            <NavLink to={empRoute(employer.DASHBOARD)}><i className="fa fa-home" /><span className="admin-nav-text">Dashboard</span></NavLink>
                        </li>
                        <li
                            className={setMenuActive(currentpath, empRoute(employer.PROFILE))}>
                            <NavLink to={empRoute(employer.PROFILE)}><i className="fa fa-user-tie" /><span className="admin-nav-text">Company Profile</span></NavLink>
                        </li>
                        <li
                            className={
                                setMenuActive(currentpath, empRoute(employer.POST_A_JOB)) +
                                setMenuActive(currentpath, empRoute(employer.MANAGE_JOBS)) +
                                setMenuActive(currentpath, empRoute(employer.CANDIDATES))
                            }>
                            <a href="#">
                                <i className="fa fa-suitcase" />
                                <span className="admin-nav-text">Jobs</span>
                            </a>
                            <ul className="sub-menu">
                                <li> <NavLink to={empRoute(employer.POST_A_JOB)} id="jobMenuId1"><span className="admin-nav-text">Post a New Job</span></NavLink></li>
                                <li> <NavLink to={empRoute(employer.MANAGE_JOBS)} id="jobMenuId2"><span className="admin-nav-text">Manage Jobs</span></NavLink></li>
                                <li><NavLink to={empRoute(employer.CANDIDATES)} id="jobMenuId3"><span className="admin-nav-text">Applied Candidates</span></NavLink></li>

                            </ul>
                        </li>

                        <li
                            className={
                                setMenuActive(currentpath, empRoute(employer.AllCANDIDATES)) +
                                setMenuActive(currentpath, empRoute(employer.CAND_BOOKMARKS))


                            }>
                            <a href="#">
                                <i className="fa fa-user-friends" />
                                <span className="admin-nav-text">Candidates</span>
                            </a>
                            <ul className="sub-menu">
                                <li> <NavLink to={empRoute(employer.AllCANDIDATES)} id="canMenuId1"><span className="admin-nav-text">All Candidates</span></NavLink></li>
                                <li> <NavLink to={empRoute(employer.CAND_BOOKMARKS)} id="canMenuId"><span className="admin-nav-text">Bookmarked Candidates</span></NavLink></li>

                            </ul>
                        </li>



                        <li className={setMenuActive(currentpath, empRoute(employer.BOOKMARKS))}>
                            <NavLink to={empRoute(employer.BOOKMARKS)} id="bookId1"><i className="fa fa-bookmark" /><span className="admin-nav-text">Bookmark Jobs</span></NavLink>
                        </li>

                        <li className={setMenuActive(currentpath, empRoute(employer.PACKAGES))}>
                            <NavLink to={empRoute(employer.PACKAGES)}><i className="fa fa-money-bill-alt" /><span className="admin-nav-text">Packages</span></NavLink>
                        </li>

                        <li className={setMenuActive(currentpath, empRoute(employer.MESSAGES1))}>
                                <NavLink to={empRoute(employer.MESSAGES1)} > <i className="fa fa-envelope" /><span className="admin-nav-text">Messages</span></NavLink>
                        </li>
                      
                        <li className={setMenuActive(currentpath, empRoute(employer.RESUME_ALERTS))}>
                            <NavLink to={empRoute(employer.RESUME_ALERTS)}><i className="fa fa-bell" /><span className="admin-nav-text">Resume Alerts</span></NavLink>
                        </li>
                        <li>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#delete-dash-profile"><i className="fa fa-trash-alt" /><span className="admin-nav-text">Delete Profile</span></a>
                        </li>
                        <li>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#logout-dash-profile">
                                <i className="fa fa-share-square" />
                                <span className="admin-nav-text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default EmpSidebarSection; 