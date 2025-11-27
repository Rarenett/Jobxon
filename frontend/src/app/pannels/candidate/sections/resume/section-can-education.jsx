import { useEffect, useState } from "react";

function SectionCanEducation() {
    const [educationList, setEducationList] = useState([]);
    const [editId, setEditId] = useState(null);

    const [level, setLevel] = useState("");
    const [course, setCourse] = useState("");
    const [university, setUniversity] = useState("");

    const token = localStorage.getItem("access_token");
    const API_URL = "http://127.0.0.1:8000/api/education/";

    // ✅ Load Education
    const loadEducation = async () => {
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            const list = Array.isArray(data) ? data : data.results || [];
            setEducationList(list);

            setTimeout(() => {
                window.$?.(".selectpicker").selectpicker("refresh");
            }, 200);
        } catch {
            setEducationList([]);
        }
    };

    useEffect(() => {
        loadEducation();
    }, []);

    // ✅ Save / Update
    const saveEducation = async () => {
        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API_URL}${editId}/` : API_URL;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ level, course, university })
        });

        if (res.ok) {
            resetForm();
            loadEducation();
            closeModal();
        } else {
            const err = await res.json();
            alert(JSON.stringify(err));
        }
    };

    // ✅ Edit
    const editEducation = (edu) => {
        setEditId(edu.id);
        setLevel(edu.level);
        setCourse(edu.course);
        setUniversity(edu.university);

        new window.bootstrap.Modal(document.getElementById("Education")).show();
    };

    // ✅ Delete
    const deleteEducation = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        const res = await fetch(`${API_URL}${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            loadEducation();
        } else {
            alert("Delete failed ❌");
        }
    };

    const resetForm = () => {
        setEditId(null);
        setLevel("");
        setCourse("");
        setUniversity("");
    };

    const closeModal = () => {
        const modal = document.getElementById("Education");
        const instance = window.bootstrap.Modal.getInstance(modal);
        instance?.hide();
    };

    return (
        <>
            {/* Header — ORIGINAL STYLE */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Education</h4>
                <a
                    href="#Education"
                    data-bs-toggle="modal"
                    role="button"
                    className="site-text-primary"
                    onClick={resetForm}
                >
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* List — ORIGINAL STYLE */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    {educationList.length === 0 ? (
                        <p>No education added</p>
                    ) : (
                        educationList.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <p><b>{edu.course}</b></p>
                                <p>{edu.level}</p>
                                <p>{edu.university}</p>

                                <a
                                    href="#Education"
                                    data-bs-toggle="modal"
                                    className="site-text-primary me-2"
                                    onClick={() => editEducation(edu)}
                                >
                                    <span className="fa fa-edit" />
                                </a>

                                <a
                                    className="site-text-primary"
                                    onClick={() => deleteEducation(edu.id)}
                                >
                                    <span className="fa fa-trash" />
                                </a>

                                <hr />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal — ORIGINAL TEMPLATE STYLE */}
            <div className="modal fade twm-saved-jobs-view" id="Education" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">Education</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Education</label>
                                            <div className="ls-inputicon-box">
                                                <select
                                                    className="wt-select-box selectpicker"
                                                    data-live-search="true"
                                                    value={level}
                                                    onChange={(e) => setLevel(e.target.value)}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option>Graduation/Diploma</option>
                                                    <option>Masters/Post-Graduation</option>
                                                    <option>Doctorate/PhD</option>
                                                </select>
                                                <i className="fs-input-icon fa fa-user-graduate" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>Course</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={course}
                                                    onChange={(e) => setCourse(e.target.value)}
                                                    placeholder="Enter Course"
                                                />
                                                <i className="fs-input-icon fa fa-book" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>University/Institute</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={university}
                                                    onChange={(e) => setUniversity(e.target.value)}
                                                    placeholder="Enter University"
                                                />
                                                <i className="fs-input-icon fas fa-book-reader" />
                                            </div>
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
                                    onClick={saveEducation}
                                >
                                    {editId ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionCanEducation;
