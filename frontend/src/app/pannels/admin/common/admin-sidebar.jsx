import JobZImage from "../../../common/jobz-img";
import { NavLink, useLocation } from "react-router-dom";
import { loadScript, setMenuActive } from "../../../../globals/constants";
import { admin, adRoute, publicUser } from "../../../../globals/route-names";
import { useEffect } from "react";

function AdminSidebarSection(props) {
    const currentpath = useLocation().pathname;

    useEffect(() => {
        loadScript("js/custom.js");
        loadScript("js/emp-sidebar.js");
    })

    return (
        <>
            <nav id="sidebar-admin-wraper" className={props.sidebarActive ? "" : "active"}>
                <div className="page-logo">
                    <NavLink to={adRoute(admin.DASHBOARD)}><JobZImage id="skin_page_logo" src="images/logo-dark.png" alt="" /></NavLink>
                </div>
                <div className="admin-nav scrollbar-macosx">
                    <ul>
                        <li
                            className={setMenuActive(currentpath, adRoute(admin.DASHBOARD))}>
                            <NavLink to={adRoute(admin.DASHBOARD)}><i className="fa fa-home" /><span className="admin-nav-text">Dashboard</span></NavLink>
                        </li>
                        <li
                            className={setMenuActive(currentpath, adRoute(admin.PROFILE))}>
                            <NavLink to={adRoute(admin.PROFILE)}><i className="fa fa-user-tie" /><span className="admin-nav-text">Company Profile</span></NavLink>
                        </li>
                        <li
                            className={
                                setMenuActive(currentpath, adRoute(admin.POST_A_JOB)) +
                                setMenuActive(currentpath, adRoute(admin.MANAGE_JOBS)) +
                                setMenuActive(currentpath, adRoute(admin.CANDIDATES))+
                                setMenuActive(currentpath, adRoute(admin.JOB_CATEGORY))

                            }>
                            <a href="#">
                                <i className="fa fa-suitcase" />
                                <span className="admin-nav-text">Jobs</span>
                            </a>
                            <ul className="sub-menu">
                                <li> <NavLink to={adRoute(admin.JOB_CATEGORY)} id="jobMenuId1"><span className="admin-nav-text">Job Category</span></NavLink></li>
                                <li> <NavLink to={adRoute(admin.POST_A_JOB)} id="jobMenuId2"><span className="admin-nav-text">Post a New Job</span></NavLink></li>
                                <li> <NavLink to={adRoute(admin.MANAGE_JOBS)} id="jobMenuId3"><span className="admin-nav-text">Manage Jobs</span></NavLink></li>
                                <li><NavLink to={adRoute(admin.CANDIDATES)} id="jobMenuId4"><span className="admin-nav-text">Applied Candidates</span></NavLink></li>

                            </ul>
                        </li>

                        <li
                            className={
                                setMenuActive(currentpath, adRoute(admin.AllCANDIDATES)) +
                                setMenuActive(currentpath, adRoute(admin.CAND_BOOKMARKS))


                            }>
                            <a href="#">
                                <i className="fa fa-user-friends" />
                                <span className="admin-nav-text">Candidates</span>
                            </a>
                            <ul className="sub-menu">
                                <li> <NavLink to={adRoute(admin.AllCANDIDATES)} id="canMenuId1"><span className="admin-nav-text">All Candidates</span></NavLink></li>
                                <li> <NavLink to={adRoute(admin.CAND_BOOKMARKS)} id="canMenuId"><span className="admin-nav-text">Bookmarked Candidates</span></NavLink></li>

                            </ul>
                        </li>



                        <li className={setMenuActive(currentpath, adRoute(admin.BOOKMARKS))}>
                            <NavLink to={adRoute(admin.BOOKMARKS)} id="bookId1"><i className="fa fa-bookmark" /><span className="admin-nav-text">Bookmark Jobs</span></NavLink>
                        </li>

                        <li className={setMenuActive(currentpath, adRoute(admin.PACKAGES))}>
                            <NavLink to={adRoute(admin.PACKAGES)}><i className="fa fa-money-bill-alt" /><span className="admin-nav-text">Packages</span></NavLink>
                        </li>

                        <li className={setMenuActive(currentpath, adRoute(admin.MESSAGES1))}>
                                <NavLink to={adRoute(admin.MESSAGES1)} > <i className="fa fa-envelope" /><span className="admin-nav-text">Messages</span></NavLink>
                        </li>
                      
                        <li className={setMenuActive(currentpath, adRoute(admin.RESUME_ALERTS))}>
                            <NavLink to={adRoute(admin.RESUME_ALERTS)}><i className="fa fa-bell" /><span className="admin-nav-text">Resume Alerts</span></NavLink>
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

export default AdminSidebarSection; 