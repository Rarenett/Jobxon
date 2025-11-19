import Header1 from "../app/common/header/header1";
import CandidateRoutes from "../routing/candidate-routes";
import SignUpPopup from "../app/common/popups/popup-signup";
import SignInPopup from "../app/common/popups/popup-signin";
import CanSidebarSection from "../app/pannels/candidate/sections/common/can-sidebar";
import InnerPageBanner from "../app/common/inner-page-banner";
import Footer1 from "../app/common/footer/footer1";
import { setBanner } from "../globals/banner-data";
import { useLocation } from "react-router-dom";
import { getHeaderConfig } from "../globals/layout-config";

function CandidateLayout() {
    const currentpath = useLocation().pathname;
    return (
        <>
            <div className="page-wraper">

                <Header1 _config={getHeaderConfig(currentpath)} />

                <div className="page-content">

                    <InnerPageBanner _data={setBanner(currentpath)} />

                    <div className="section-full p-t120  p-b90 site-bg-white">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4 col-md-12 rightSidebar m-b30">
                                    <div className="side-bar-st-1">
                                        <CanSidebarSection />
                                    </div>
                                </div>
                                <div className="col-xl-9 col-lg-8 col-md-12 m-b30">
                                    
                                    <CandidateRoutes />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer1 />

                {/* BUTTON TOP START */}
                <button className="scroltop"><span className="fa fa-angle-up  relative" id="btn-vibrate" /></button>

                <SignUpPopup />
                <SignInPopup />

            </div>
        </>
    )
}

export default CandidateLayout;