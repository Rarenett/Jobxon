import { useEffect, useState } from "react";

function SectionCanEducation() {
    const [educationList, setEducationList] = useState([]);

    const [editId, setEditId] = useState(null);

    const [level, setLevel] = useState("");
    const [course, setCourse] = useState("");
    const [university, setUniversity] = useState("");

    const token = localStorage.getItem("access_token");

    // 🔹 Load Education
    const loadEducation = () => {
        fetch("http://127.0.0.1:8000/api/education/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const list = Array.isArray(data) ? data : data.results || [];
            setEducationList(list);
        });
    };

    useEffect(() => {
        loadEducation();
    }, []);

    // ✅ Save or Update
    const saveEducation = async () => {
        const url = editId
            ? `http://127.0.0.1:8000/api/education/${editId}/`
            : `http://127.0.0.1:8000/api/education/`;

        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
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
            alert("Save failed ❌");
        }
    };

    // ✅ Edit Education
    const editEducation = (edu) => {
        setEditId(edu.id);
        setLevel(edu.level);
        setCourse(edu.course);
        setUniversity(edu.university);

        const modal = new window.bootstrap.Modal(
            document.getElementById("Education")
        );
        modal.show();
    };

    // ✅ Delete Education
    const deleteEducation = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        const res = await fetch(`http://127.0.0.1:8000/api/education/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            loadEducation();
        } else {
            alert("Delete failed ❌");
        }
    };

    // ✅ Helpers
    const resetForm = () => {
        setEditId(null);
        setLevel("");
        setCourse("");
        setUniversity("");
    };

    const closeModal = () => {
        const modal = document.getElementById("Education");
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        modalInstance?.hide();
    };

    return (
        <>
            {/* Header */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn">
                <h4 className="panel-tittle m-a0">Education</h4>
                <button
                    data-bs-toggle="modal"
                    data-bs-target="#Education"
                    className="site-text-primary"
                    style={{ background: "none", border: "none" }}
                    onClick={resetForm}
                >
                    <span className="fa fa-plus" /> Add
                </button>
            </div>

            {/* List */}
            <div className="panel-body wt-panel-body p-a20">
                <div className="twm-panel-inner">
                    {educationList.length === 0 ? (
                        <p>No education found</p>
                    ) : (
                        educationList.map((edu) => (
                            <div key={edu.id} className="mb-3 border p-2 rounded">
                                <b>{edu.course}</b>
                                <p>{edu.level}</p>
                                <p>{edu.university}</p>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-"
                                        onClick={() => editEducation(edu)}
                                    >
                                         <span className="fa fa-edit" />
                                    </button>

                                    <button
                                        className="btn btn-sm btn-"
                                        onClick={() => deleteEducation(edu.id)}
                                    >
                                         <span className="far fa-trash-alt" />
                                    </button>
                                </div>
                                <hr />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="Education" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editId ? "Edit Education" : "Add Education"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body">
                            <select
                                className="form-control mb-2"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="">Select Level</option>
                                <option>Graduation/Diploma</option>
                                <option>Masters/Post-Graduation</option>
                                <option>Doctorate/PhD</option>
                            </select>

                            <input
                                className="form-control mb-2"
                                placeholder="Course"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                            />

                            <input
                                className="form-control mb-2"
                                placeholder="University"
                                value={university}
                                onChange={(e) => setUniversity(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="site-button" onClick={saveEducation}>
                                {editId ? "Update" : "Save"}
                            </button>
                            <button
                                className="site-button"
                                data-bs-dismiss="modal"
                                onClick={resetForm}
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

export default SectionCanEducation;
