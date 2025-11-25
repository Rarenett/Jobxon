import { useEffect, useState } from "react";

function SectionCanEmployment() {
    const [designation, setDesignation] = useState("");
    const [organization, setOrganization] = useState("");
    const [isCurrent, setIsCurrent] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");

    const [employmentList, setEmploymentList] = useState([]); 
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("access_token");

    // --------------------------------------------
    // ✅ Load Employments
    // --------------------------------------------
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/employment/", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data) ? data : data.results || [];
                setEmploymentList(list);
            })
            .catch(err => {
                console.error("Error loading employment:", err);
                setEmploymentList([]);
            });
    }, []);

    // --------------------------------------------
    // ✅ Save Employment
    // --------------------------------------------
    const saveEmployment = async () => {
        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/employment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    designation,
                    organization,
                    is_current_company: isCurrent,
                    start_date: startDate,
                    end_date: isCurrent ? null : endDate,
                    job_description: description
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert("ERROR:\n" + JSON.stringify(data, null, 2));
                setLoading(false);
                return;
            }

            // Success
            alert("Employment added successfully ✅");

            // Update list without reload
            setEmploymentList(prev => [...prev, data]);

            // Reset form
            setDesignation("");
            setOrganization("");
            setIsCurrent(false);
            setStartDate("");
            setEndDate("");
            setDescription("");

            // Close modal
            const modal = document.getElementById("Employment");
            const bootstrapModal = window.bootstrap?.Modal.getInstance(modal);
            bootstrapModal?.hide();

        } catch (err) {
            console.error("Fetch error:", err);
            alert("Network error ❌");
        }

        setLoading(false);
    };

    return (
        <>
            {/* ---------------- Header --------------- */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn">
                <h4 className="panel-tittle m-a0">Employment</h4>
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#Employment"
                    className="site-text-primary"
                    style={{ border: "none", background: "transparent" }}
                >
                    <span className="fa fa-edit"></span>
                </button>
            </div>

            {/* ---------------- Employment List --------------- */}
            <div className="panel-body wt-panel-body p-a20">
                {employmentList.length === 0 ? (
                    <p>No employment added</p>
                ) : (
                    employmentList.map((emp, index) => (
                        <div key={emp.id || index} className="mb-3">
                            <p><b>{emp.designation}</b></p>
                            <p>{emp.organization}</p>
                            <p>{emp.is_current_company ? "Currently Working" : "Previously Worked"}</p>
                            <p>{emp.start_date} - {emp.end_date || "Present"}</p>
                            <p>{emp.job_description}</p>
                            <hr />
                        </div>
                    ))
                )}
            </div>

            {/* ---------------- Modal --------------- */}
            <div className="modal fade" id="Employment" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Add Employment</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <input
                                className="form-control mb-2"
                                placeholder="Designation"
                                value={designation}
                                onChange={e => setDesignation(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                placeholder="Organization"
                                value={organization}
                                onChange={e => setOrganization(e.target.value)}
                            />

                            <div className="form-check mb-2">
                                <input
                                    type="checkbox"
                                    id="isCurrentJob"
                                    className="form-check-input"
                                    checked={isCurrent}
                                    onChange={e => setIsCurrent(e.target.checked)}
                                />
                                <label htmlFor="isCurrentJob">Is Current Company?</label>
                            </div>

                            <label>Start Date</label>
                            <input
                                type="date"
                                className="form-control mb-2"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />

                            {!isCurrent && (
                                <>
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                    />
                                </>
                            )}

                            <label>Job Description</label>
                            <textarea
                                className="form-control"
                                placeholder="Describe your job role"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="site-button" 
                                onClick={saveEmployment}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button className="site-button" data-bs-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanEmployment;
