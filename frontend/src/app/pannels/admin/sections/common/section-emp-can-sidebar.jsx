import SectionContact from "./section-contact";
import SectionLocation from "./section-location";
import SectionProfile from "./section-profile";

function SectionEmployersCandidateSidebarAdmin({ type, company, getImageUrl }) {
    return (
        <>
            <div className="side-bar-2">
                {type === "1" ? (
                    <>
                        <div className="twm-s-map mb-5">
                            <SectionLocation company={company} />
                        </div>
                        <div className="twm-s-info-wrap mb-5">
                            <SectionProfile company={company} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="twm-s-info-wrap mb-5">
                            <SectionProfile company={company} />
                        </div>
                        <div className="twm-s-map mb-5">
                            <SectionLocation company={company} />
                        </div>
                    </>
                )}
                <div className="twm-s-contact-wrap mb-5">
                    <SectionContact company={company} />
                </div>
            </div>
        </>
    );
}

export default SectionEmployersCandidateSidebarAdmin;
