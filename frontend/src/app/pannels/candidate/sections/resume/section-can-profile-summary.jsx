import { useEffect, useState } from "react";

function SectionCanProfileSummary() {
    const token = localStorage.getItem("access_token");

    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Load existing summary
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/profile-summary/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    setSummary(data[0].summary);
                }
            })
            .catch(err => console.error("Load error:", err));
    }, []);

    // ✅ Save / Update summary
    const saveSummary = async () => {
        setLoading(true);

        try {
            // check if already exists
            const listRes = await fetch("http://127.0.0.1:8000/api/profile-summary/", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const listData = await listRes.json();

            let method = "POST";
            let url = "http://127.0.0.1:8000/api/profile-summary/";

            if (listData.length > 0) {
                method = "PUT";
                url = `http://127.0.0.1:8000/api/profile-summary/${listData[0].id}/`;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ summary })
            });

            if (!res.ok) {
                const err = await res.json();
                alert("Error: " + JSON.stringify(err));
                return;
            }

            alert("Profile Summary saved ✅");

            // Close modal
            const modal = document.getElementById("Profile_Summary");
            const bootstrapModal = window.bootstrap?.Modal.getInstance(modal);
            bootstrapModal?.hide();

        } catch (err) {
            console.error("Save error:", err);
            alert("Network error ❌");
        }

        setLoading(false);
    };

    return (
        <>
            {/* ===== Header ===== */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Profile Summary</h4>
                <a data-bs-toggle="modal" href="#Profile_Summary" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* ===== Body ===== */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>{summary || "Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters."}</p>
                </div>
            </div>

            {/* ===== Modal ===== */}
            <div className="modal fade twm-saved-jobs-view" id="Profile_Summary" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Profile Summary</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>

                            <div className="modal-body">
                                <p>Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of a career you are looking for. Write a meaningful summary of more than 50 characters.</p>

                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div className="form-group twm-textarea-full">
                                            <textarea
                                                className="form-control"
                                                placeholder="Detail of Project"
                                                value={summary}
                                                onChange={(e) => setSummary(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="site-button"
                                    onClick={saveSummary}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanProfileSummary;
