import JobZImage from "../jobz-img";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../globals/route-names";
import { useState } from "react";

function Header1({ _config }) {

    const [menuActive, setMenuActive] = useState(false);

    function handleNavigationClick() {
        setMenuActive(!menuActive);
    }

    return (
        <>
            <header className={"site-header " + _config.style + " mobile-sider-drawer-menu " + (menuActive ? "active" : "")}>
                <div className="sticky-header main-bar-wraper navbar-expand-lg">
                    <div className="main-bar">
                        <div className="container-fluid clearfix">
                            <div className="logo-header">
                                <div className="logo-header-inner logo-header-one">
                                    <NavLink to={publicUser.HOME1}>
                                        {
                                            _config.withBlackLogo
                                                ?
                                                <JobZImage src="images/logo-12.png" alt="" />
                                                :
                                                (
                                                    _config.withWhiteLogo
                                                        ?
                                                        <JobZImage src="images/logo-white.png" alt="" />
                                                        :
                                                        (
                                                            _config.withLightLogo ?
                                                                <>
                                                                    <JobZImage id="skin_header_logo_light" src="images/logo-light-3.png" alt="" className="default-scroll-show" />
                                                                    <JobZImage id="skin_header_logo" src="images/logo-dark.png" alt="" className="on-scroll-show" />
                                                                </> :
                                                                <JobZImage id="skin_header_logo" src="images/logo-dark.png" alt="" />
                                                        )
                                                )
                                        }
                                    </NavLink>
                                </div>
                            </div>
                            {/* NAV Toggle Button */}
                            <button id="mobile-side-drawer"
                                data-target=".header-nav"
                                data-toggle="collapse"
                                type="button"
                                className="navbar-toggler collapsed"
                                onClick={handleNavigationClick}
                            >
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar icon-bar-first" />
                                <span className="icon-bar icon-bar-two" />
                                <span className="icon-bar icon-bar-three" />
                            </button>
                            {/* MAIN Vav */}
                            <div className="nav-animation header-nav navbar-collapse collapse d-flex justify-content-center">
                                <ul className=" nav navbar-nav">

                                    <li className="has-child"><a href="#">Jobs</a>
                                        <ul className="sub-menu">
                                            <li><NavLink to={publicUser.jobs.GRID}>Jobs For You</NavLink></li>
                                            <li><NavLink to={publicUser.jobs.GRID_MAP}>Preffered Jobs</NavLink></li>
                                            {/* <li><NavLink to={publicUser.jobs.LIST}>Jobs List</NavLink></li> */}
                                            {/* <li className="has-child"><a href="#">Job Detail</a>
                                                <ul className="sub-menu">
                                                    <li><NavLink to={publicUser.jobs.DETAIL1}>Detail 1</NavLink>
                                                    </li><li><NavLink to={publicUser.jobs.DETAIL2}>Detail 2 </NavLink>
                                                    </li></ul>
                                            </li> */}
                                            {/* <li><NavLink to={publicUser.jobs.APPLY}>Apply Jobs</NavLink></li> */}
                                        </ul>
                                    </li>
                                    <li className="has-child"><NavLink to={publicUser.employer.GRID}>Companies</NavLink>
                                        {/* <ul className="sub-menu">
                                            <li><NavLink to={publicUser.employer.GRID}>Employers Grid</NavLink></li>
                                            <li><NavLink to={publicUser.employer.LIST}>Employers List</NavLink></li>
                                            <li className="has-child"><a href="#">Employers Detail</a>
                                                <ul className="sub-menu">
                                                    <li><NavLink to={publicUser.employer.DETAIL1}>Detail 1</NavLink>
                                                    </li><li><NavLink to={publicUser.employer.DETAIL2}>Detail 2</NavLink>
                                                    </li></ul>
                                            </li>
                                        </ul> */}
                                    </li>
                                    {/* <li className="has-child"><NavLink to={publicUser.candidate.LIST}>Candidates</NavLink>
                                    </li> */}
                                        {/* <ul className="sub-menu">
                                            <li><NavLink to={publicUser.candidate.GRID}>Candidates Grid</NavLink></li>
                                            <li><NavLink to={publicUser.candidate.LIST}>Candidates List</NavLink></li>
                                            <li className="has-child"><a href="#">Candidate Detail</a>
                                            <ul className="sub-menu">
                                            <li><NavLink to={publicUser.candidate.DETAIL1}>Detail 1</NavLink>
                                            </li><li><NavLink to={publicUser.candidate.DETAIL2}>Detail 2</NavLink>
                                            </li></ul>
                                            </li>
                                            </ul> */}


                                    <li className="has-child"><NavLink to={publicUser.blog.GRID2}>Blog</NavLink>
                                        {/* <ul className="sub-menu">
                                            <li><NavLink to={publicUser.blog.GRID1}>Blog</NavLink></li>
                                            <li><NavLink to={publicUser.blog.GRID2}>Blog Grid</NavLink></li>
                                            <li><NavLink to={publicUser.blog.GRID3}>Blog Grid-2</NavLink></li>
                                            <li><NavLink to={publicUser.blog.LIST}>Blog List</NavLink></li>
                                            <li><NavLink to={publicUser.blog.DETAIL}>Blog Detail</NavLink></li>
                                        </ul> */}
                                    </li>

                                    <li className="has-child"><a href="#">More</a>
                                        <ul className="sub-menu">
                                            <li><NavLink to={publicUser.pages.ABOUT}>About Us</NavLink></li>
                                            <li><NavLink to={publicUser.pages.PRICING}>Pricing</NavLink></li>
                                            <li><NavLink to={publicUser.pages.FAQ}>FAQ's</NavLink></li>
                                            <li><NavLink to={publicUser.pages.CONTACT}>Contact Us</NavLink></li>
                                            {/* <li><NavLink to={publicUser.pages.MAINTENANCE}>Under Maintenance</NavLink></li>
                                            <li><NavLink to={publicUser.pages.COMING}>Coming soon</NavLink></li>
                                            <li><NavLink to={publicUser.pages.LOGIN}>Login</NavLink></li>
                                            <li><NavLink to={publicUser.pages.AFTER_LOGIN}>After Login</NavLink></li>
                                            <li><NavLink to={publicUser.pages.ICONS}>Icons</NavLink></li>
                                            <li><NavLink to={publicUser.pages.ERROR404}>Error-404</NavLink></li> */}

                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            {/* Header Right Section*/}
                            <div className="extra-nav header-2-nav">
                                <div className="extra-cell">
                                    <div className="header-search">
                                        <a href="#search" className="header-search-icon"><i className="feather-search" /></a>
                                    </div>
                                </div>
                                <div className="extra-cell">
                                    <div className="header-nav-btn-section">
                                        <div className="twm-nav-btn-left">
                                            <a className="twm-nav-sign-up" data-bs-toggle="modal" href="#sign_up_popup" role="button">
                                                <i className="feather-log-in" /> Sign Up
                                            </a>
                                        </div>
                                        <div className="twm-nav-btn-right">
                                            <a className="twm-nav-post-a-job" data-bs-toggle="modal" href="#sign_up_popup2" role="button">
                                                <i className="feather-log-in" /> Sign In
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SITE Search */}
                    <div id="search">
                        <span className="close" />
                        <form role="search" id="searchform" action="/search" method="get" className="radius-xl">
                            <input className="form-control" name="q" type="search" placeholder="Type to search" />
                            <span className="input-group-append">
                                <button type="button" className="search-btn">
                                    <i className="fa fa-paper-plane" />
                                </button>
                            </span>
                        </form>
                    </div>
                </div>
            </header>

        </>
    )
}

export default Header1;