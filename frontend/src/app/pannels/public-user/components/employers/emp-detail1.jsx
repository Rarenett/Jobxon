import JobZImage from "../../../../common/jobz-img";
import SectionEmployersCandidateSidebar from "../../sections/common/section-emp-can-sidebar";
import SectionShareProfile from "../../sections/common/section-share-profile";
import SectionOfficePhotos1 from "../../sections/common/section-office-photos1";
import SectionOfficeVideo1 from "../../sections/common/section-office-video1";
import SectionAvailableJobsList from "../../sections/employers/detail/section-available-jobs-list";
import { useEffect } from "react";
import { loadScript } from "../../../../../globals/constants";

function EmployersDetail1Page() {

    useEffect(()=>{
        loadScript("js/custom.js")
    })

    return (
        <>
            <div className="section-full  p-t120 p-b90 bg-white">
                <div className="container">
                    <div className="section-content">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8 col-md-12">
                                {/* Candidate detail START */}
                                <div className="cabdidate-de-info">
                                    <div className="twm-employer-self-wrap">
                                        <div className="twm-employer-self-info">
                                            <div className="twm-employer-self-top">
                                                <div className="twm-media-bg">
                                                    <JobZImage src="images/employer-bg.jpg" alt="#" />
                                                </div>
                                                <div className="twm-mid-content">
                                                    <div className="twm-media">
                                                        <JobZImage src="images/jobs-company/pic1.jpg" alt="#" />
                                                    </div>
                                                    <h4 className="twm-job-title">Galaxy Software Development</h4>
                                                    <p className="twm-employer-address"><i className="feather-map-pin" />1363-1385 Sunset Blvd Los Angeles, CA 90026, USA</p>
                                                    <a href="https://themeforest.net/user/thewebmax/portfolio" className="twm-employer-websites site-text-primary">https://thewebmax.com</a>
                                                    <div className="twm-employer-self-bottom">
                                                        <a href="#" className="site-button outline-primary">Add Review</a>
                                                        <a href="#" className="site-button">Follow Us</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="twm-s-title">About Company</h4>
                                    <p>UUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                                        consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? </p>
                                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui  officia deserunt mollitia animi.</p>
                                    <p>Opossum but dramatically despite expeditiously that jeepers loosely yikes that as or eel underneath kept and slept compactly far purred sure abidingly up above fitting to strident wiped set waywardly far the and pangolin horse approving paid chuckled cassowary oh above a much opposite far much hypnotically more therefore wasp less that  hey apart well like while superbly orca and far hence one.Far much that one rank beheld bluebird after outside ignobly  allegedly more when oh arrogantly vehement irresistibly fussy.? </p>
                                    <h4 className="twm-s-title">Responsabilities</h4>
                                    <ul className="description-list-2">
                                        <li>
                                            <i className="feather-check" />
                                            Establish and promote design guidelines, best practices and standards.
                                        </li>
                                        <li>
                                            <i className="feather-check" />
                                            Accurately estimate design tickets during planning sessions.
                                        </li>
                                        <li>
                                            <i className="feather-check" />
                                            Partnering with product and engineering to translate business and user goals.
                                        </li>
                                    </ul>
                                    
                                    <SectionShareProfile />
                                    
                                    <div className="twm-two-part-section">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <SectionOfficePhotos1 />
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <SectionOfficeVideo1 />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <SectionAvailableJobsList />
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 rightSidebar">
                                <SectionEmployersCandidateSidebar type="1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployersDetail1Page;