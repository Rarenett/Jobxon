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
    const API_URL = "http://127.0.0.1:8000/api/employment/";

    // ✅ Load Employments
    const loadEmployments = async () => {
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            const list = Array.isArray(data) ? data : data.results || [];
            setEmploymentList(list);
        } catch {
            setEmploymentList([]);
        }
    };

    useEffect(() => {
        loadEmployments();
    }, []);

    // ✅ Save Employment
    const saveEmployment = async () => {
        setLoading(true);

        try {
            const res = await fetch(API_URL, {
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
                alert(JSON.stringify(data, null, 2));
                setLoading(false);
                return;
            }

            setEmploymentList(prev => [...prev, data]);

            // Reset
            resetForm();

            // Close modal
            const modal = document.getElementById("Employment");
            const instance = window.bootstrap.Modal.getInstance(modal);
            instance?.hide();

        } catch {
            alert("Network error ❌");
        }

        setLoading(false);
    };

    const resetForm = () => {
        setDesignation("");
        setOrganization("");
        setIsCurrent(false);
        setStartDate("");
        setEndDate("");
        setDescription("");
    };

    return (
        <>
            {/* ✅ Header — Original Style */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Employment</h4>
                <a
                    data-bs-toggle="modal"
                    href="#Employment"
                    role="button"
                    className="site-text-primary"
                    onClick={resetForm}
                >
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* ✅ Employment List — Original Style */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    {employmentList.length === 0 ? (
                        <p>No employment added</p>
                    ) : (
                        employmentList.map((emp, index) => (
                            <div key={emp.id || index} className="mb-3">
                                <p><b>{emp.designation}</b></p>
                                <p>{emp.organization}</p>
                                <p>
                                    {emp.start_date} to {emp.end_date || "Present"}
                                </p>
                                <p>{emp.job_description}</p>
                                <hr />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ✅ Modal — Original Jobzilla Form Layout */}
            <div className="modal fade twm-saved-jobs-view" id="Employment" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Employment</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Designation</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={designation}
                                                    onChange={(e) => setDesignation(e.target.value)}
                                                    placeholder="Enter Designation"
                                                />
                                                <i className="fs-input-icon fa fa-address-card" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Organization</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={organization}
                                                    onChange={(e) => setOrganization(e.target.value)}
                                                    placeholder="Enter Organization"
                                                />
                                                <i className="fs-input-icon fa fa-building" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group twm-form-radio-inline">
                                            <label>Currently working here?</label>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <input
                                                        type="radio"
                                                        checked={isCurrent === true}
                                                        onChange={() => setIsCurrent(true)}
                                                    />
                                                    <label>Yes</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <input
                                                        type="radio"
                                                        checked={isCurrent === false}
                                                        onChange={() => setIsCurrent(false)}
                                                    />
                                                    <label>No</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Start Date */}
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                />
                                                <i className="fs-input-icon far fa-calendar" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* End Date */}
                                    {!isCurrent && (
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label>End Date</label>
                                                <div className="ls-inputicon-box">
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                    />
                                                    <i className="fs-input-icon far fa-calendar" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-md-12">
                                        <div className="form-group mb-0">
                                            <label>Job Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Describe your role"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="site-button"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="site-button"
                                    onClick={saveEmployment}
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

export default SectionCanEmployment;
