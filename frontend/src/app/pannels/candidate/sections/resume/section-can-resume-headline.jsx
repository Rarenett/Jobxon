import { useEffect, useState } from "react";

function SectionCanResumeHeadline() {
    const [headline, setHeadline] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Load data from API
    useEffect(() => {
        const fetchHeadline = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/resume-headline/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                });

                const data = await res.json();
                setHeadline(data.headline || "");
            } catch (err) {
                console.log("Failed to load headline");
            }
        };

        fetchHeadline();
    }, []);

    // ✅ Save data to API
    const saveHeadline = async () => {
        if (!headline.trim()) {
            setMessage("Headline cannot be empty ❌");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/resume-headline/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify({ headline })
            });

            if (res.ok) {
                setMessage("Saved successfully ✅");

                // ✅ Close modal
                const modal = document.getElementById("Resume_Headline");
                const bsModal = window.bootstrap?.Modal.getInstance(modal);
                bsModal?.hide();
            } else {
                setMessage("Save failed ❌");
            }
        } catch (err) {
            setMessage("Server error ❌");
        }

        setLoading(false);
    };

    
    return (
        <>
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn">
                <h4 className="panel-tittle m-a0">Resume Headline</h4>
                <a
                    data-bs-toggle="modal"
                    href="#Resume_Headline"
                    role="button"
                    title="Edit"
                    className="site-text-primary"
                >
                    <span className="fa fa-edit" />
                </a>
            </div>

            <div className="panel-body wt-panel-body p-a20">
                <div className="twm-panel-inner">
                    <p>{headline || "No headline added yet"}</p>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="Resume_Headline" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Resume Headline</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body">
                            <textarea
                                className="form-control"
                                rows="4"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                            />

                            {message && (
                                <p className="mt-2 text-success">{message}</p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="site-button"
                                onClick={saveHeadline}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                className="site-button"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanResumeHeadline;
