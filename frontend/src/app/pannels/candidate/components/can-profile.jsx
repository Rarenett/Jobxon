import SectionCandicateBasicInfo from "../sections/profile/section-can-basic-info";
import SectionCandidateSocialInfo from "../sections/profile/section-can-social-info";

function CanProfilePage() {
    return (
        <>
            <div className="twm-right-section-panel site-bg-gray">

                {/*Basic Information*/}
                <SectionCandicateBasicInfo />

                {/*Social Network*/}
                <SectionCandidateSocialInfo />
                
            </div>
        </>
    )
}

export default CanProfilePage;