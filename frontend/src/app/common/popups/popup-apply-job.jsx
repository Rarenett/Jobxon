import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionApplyJob from "../../pannels/public-user/sections/jobs/section-apply-job";

function ApplyJobPopup({ jobId, jobTitle }) {
    const navigate = useNavigate();

    useEffect(() => {
        const modalElement = document.getElementById("apply_job_popup");
        if (!modalElement) return;

        const handleShow = (event) => {
            const token = localStorage.getItem("access_token"); // adjust key if needed

            if (!token) {
                event.preventDefault();

                // Safely get bootstrap modal instance if available
                const bs = window.bootstrap;
                if (bs) {
                    const modalInstance = bs.Modal.getInstance(modalElement) || new bs.Modal(modalElement);
                    modalInstance.hide();
                }

                alert("Please login to apply for this job.");
                navigate("/login"); // adjust to your login route
            }
        };

        modalElement.addEventListener("show.bs.modal", handleShow);

        return () => {
            modalElement.removeEventListener("show.bs.modal", handleShow);
        };
    }, [navigate]);

    return (
        <div
            className="modal fade"
            id="apply_job_popup"
            aria-hidden="true"
            tabIndex={-1}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="sign_up_popupLabel">
                            Apply For This Job{jobTitle ? ` - ${jobTitle}` : ""}
                        </h4>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div className="modal-body">
                        <div className="apl-job-inpopup">
                            <div className="panel panel-default">
                                <div className="panel-body wt-panel-body p-a20 ">
                                    <SectionApplyJob jobId={jobId} jobTitle={jobTitle} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplyJobPopup;
