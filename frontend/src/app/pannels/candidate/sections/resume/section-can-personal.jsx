import { useEffect, useState } from "react";

function SectionCanPersonalDetail() {
    const [detail, setDetail] = useState({});
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("access_token");
    const API_URL = "http://127.0.0.1:8000/api/personal-details/";

    // Load existing personal details
    useEffect(() => {
        fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const d = Array.isArray(data) ? data[0] : data.results?.[0];
                if (d) {
                    setDetail(d);
                    setEditId(d.id);
                }
            });
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setDetail({
            ...detail,
            [e.target.name]: e.target.value
        });
    };

    // Save Details
    const saveDetails = async () => {
        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API_URL}${editId}/` : API_URL;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(detail)
        });

        if (res.ok) {
            const modal = window.bootstrap.Modal.getInstance(
                document.getElementById("Personal_Details")
            );
            modal?.hide();
            window.location.reload();
        } else {
            alert("Save failed ❌");
        }
    };

    return (
        <>
            {/* HEADER */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Personal Details</h4>
                <a data-bs-toggle="modal" href="#Personal_Details" role="button" title="Edit" className="site-text-primary">
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* DISPLAY */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Date of Birth</div>
                                <span className="twm-s-info-discription">
                                    {detail.date_of_birth || "Add Date of Birth"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Permanent Address</div>
                                <span className="twm-s-info-discription">
                                    {detail.permanent_address || "Add Permanent Address"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Gender</div>
                                <span className="twm-s-info-discription">
                                    {detail.gender || "Not specified"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Area Pin Code</div>
                                <span className="twm-s-info-discription">
                                    {detail.pincode || "Add Pincode"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Marital Status</div>
                                <span className="twm-s-info-discription">
                                    {detail.marital_status || "Not specified"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Hometown</div>
                                <span className="twm-s-info-discription">
                                    {detail.hometown || "Add Hometown"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Passport Number</div>
                                <span className="twm-s-info-discription">
                                    {detail.passport_number || "Add Passport Number"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Work Permit Country</div>
                                <span className="twm-s-info-discription">
                                    {detail.work_permit_country || "Add Country"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Assistance Needed</div>
                                <span className="twm-s-info-discription">
                                    {detail.assistance_needed || "None"}
                                </span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="twm-s-detail-section">
                                <div className="twm-title">Languages</div>
                                <span className="twm-s-info-discription">
                                    {detail.languages || "Add Languages"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL (unchanged style, only added binding) */}
            <div className="modal fade twm-saved-jobs-view" id="Personal_Details" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Personal Detail</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>

                            <div className="modal-body">
                                <div className="row">

                                    <div className="col-xl-12">
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date_of_birth"
                                            value={detail.date_of_birth || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Gender</label>
                                        <select
                                            className="form-control"
                                            name="gender"
                                            value={detail.gender || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Permanent Address</label>
                                        <input
                                            className="form-control"
                                            name="permanent_address"
                                            value={detail.permanent_address || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Hometown</label>
                                        <input
                                            className="form-control"
                                            name="hometown"
                                            value={detail.hometown || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Pincode</label>
                                        <input
                                            className="form-control"
                                            name="pincode"
                                            value={detail.pincode || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Marital Status</label>
                                        <select
                                            className="form-control"
                                            name="marital_status"
                                            value={detail.marital_status || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option>Single</option>
                                            <option>Married</option>
                                        </select>
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Passport Number</label>
                                        <input
                                            className="form-control"
                                            name="passport_number"
                                            value={detail.passport_number || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Assistance Needed</label>
                                        <textarea
                                            className="form-control"
                                            name="assistance_needed"
                                            value={detail.assistance_needed || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Work Permit Country</label>
                                        <input
                                            className="form-control"
                                            name="work_permit_country"
                                            value={detail.work_permit_country || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-xl-12">
                                        <label>Languages</label>
                                        <input
                                            className="form-control"
                                            name="languages"
                                            value={detail.languages || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="site-button" onClick={saveDetails}>
                                    Save
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanPersonalDetail;
