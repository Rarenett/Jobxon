import { useEffect, useState } from "react";

function SectionCanDesiredProfile() {

    const token = localStorage.getItem("access_token");
    const API_URL = "http://127.0.0.1:8000/api/desired-career/";

    const [id, setId] = useState(null);

    const [form, setForm] = useState({
        industry: "",
        functional_area: "",
        role: "",
        job_type: "",
        employment_type: "",
        preferred_shift: "",
        availability_to_join: "",
        salary_currency: "INR",
        salary_lakh: "",
        salary_thousand: "",
        desired_location: "",
        desired_industry: ""
    });

    // 🔹 Load existing profile
    useEffect(() => {
        fetch(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const item = Array.isArray(data) ? data[0] : data?.results?.[0];
                if (item) {
                    setId(item.id);
                    setForm(item);
                }
            });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveProfile = async () => {
        const method = id ? "PUT" : "POST";
        const url = id ? `${API_URL}${id}/` : API_URL;

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        document.getElementById("DesiredModalClose").click();
    };

    return (
        <>
            {/* HEADER */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Desired Career Profile</h4>
                <a data-bs-toggle="modal" href="#Desired_Career" role="button" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* DISPLAY */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <div className="row">

                        {[
                            ["Industry", form.industry],
                            ["Functional Area", form.functional_area],
                            ["Role", form.role],
                            ["Job Type", form.job_type],
                            ["Employment Type", form.employment_type],
                            ["Desired Shift", form.preferred_shift],
                            ["Availability to Join", form.availability_to_join],
                            ["Expected Salary", `${form.salary_lakh} ${form.salary_thousand}`],
                            ["Desired Location", form.desired_location],
                            ["Desired Industry", form.desired_industry]
                        ].map(([label, value], i) => (
                            <div className="col-md-6" key={i}>
                                <div className="twm-s-detail-section">
                                    <div className="twm-title">{label}</div>
                                    <span className="twm-s-info-discription">
                                        {value || "Add"}
                                    </span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* MODAL WITH SAME DESIGN */}
            <div className="modal fade twm-saved-jobs-view" id="Desired_Career" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Desired Career Profile</h2>
                                <button id="DesiredModalClose" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                <div className="row">

                                    {/* Industry */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Industry</label>
                                            <div className="ls-inputicon-box">
                                                <select
                                                    name="industry"
                                                    className="wt-select-box selectpicker form-control"
                                                    value={form.industry}
                                                    onChange={handleChange}
                                                >
                                                    <option>Accounting / Finance</option>
                                                    <option>Banking / Financial Services / Broking</option>
                                                    <option>Education / Teaching / Training</option>
                                                    <option>IT-Hardware / Networking</option>
                                                    <option>Other</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-industry" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Functional */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Functional Area / Department</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    name="functional_area"
                                                    className="form-control"
                                                    value={form.functional_area}
                                                    onChange={handleChange}
                                                />
                                                <i className="fs-input-icon fa fa-building" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Role</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    name="role"
                                                    className="form-control"
                                                    value={form.role}
                                                    onChange={handleChange}
                                                />
                                                <i className="fs-input-icon fa fa-globe-americas" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Type */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Job Type</label>
                                            <select name="job_type" className="form-control" value={form.job_type} onChange={handleChange}>
                                                <option>Permanent</option>
                                                <option>Contractual</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Employment Type */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Employment Type</label>
                                            <select name="employment_type" className="form-control" value={form.employment_type} onChange={handleChange}>
                                                <option>Full Time</option>
                                                <option>Part Time</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Preferred Shift */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Preferred Shift</label>
                                            <select name="preferred_shift" className="form-control" value={form.preferred_shift} onChange={handleChange}>
                                                <option>Day</option>
                                                <option>Night</option>
                                                <option>Part Time</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Availability to Join</label>
                                            <input
                                                type="date"
                                                name="availability_to_join"
                                                className="form-control"
                                                value={form.availability_to_join || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="col-xl-6 col-lg-6">
                                        <div className="form-group">
                                            <label>Lakh</label>
                                            <input name="salary_lakh" className="form-control" value={form.salary_lakh} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-6">
                                        <div className="form-group">
                                            <label>Thousand</label>
                                            <input name="salary_thousand" className="form-control" value={form.salary_thousand} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Desired Location</label>
                                            <input name="desired_location" className="form-control" value={form.desired_location} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Industry */}
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group mb-0">
                                            <label>Desired Industry</label>
                                            <input name="desired_industry" className="form-control" value={form.desired_industry} onChange={handleChange} />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="site-button" onClick={saveProfile}>Save</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanDesiredProfile;
