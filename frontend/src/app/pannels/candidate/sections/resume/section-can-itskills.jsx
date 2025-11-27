import { useEffect, useState } from "react";

function SectionCanITSkills() {
    const token = localStorage.getItem("access_token");

    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        skill_name: "",
        version: "",
        last_used_year: "",
        experience_years: "",
        experience_months: ""
    });

    const [editId, setEditId] = useState(null);

    // =========================
    // Fetch Skills
    // =========================
    const fetchSkills = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/it-skills/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setSkills(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading skills", err);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    // =========================
    // Open modal for add
    // =========================
    const openAddModal = () => {
        setEditId(null);
        setFormData({
            skill_name: "",
            version: "",
            last_used_year: "",
            experience_years: "",
            experience_months: ""
        });
    };

    // =========================
    // Open modal for edit
    // =========================
    const openEditModal = (skill) => {
        setEditId(skill.id);
        setFormData(skill);
    };

    // =========================
    // Save Skill (Create/Update)
    // =========================
    const saveSkill = async () => {
        const url = editId
            ? `http://127.0.0.1:8000/api/it-skills/${editId}/`
            : "http://127.0.0.1:8000/api/it-skills/";

        const method = editId ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        fetchSkills();
        document.getElementById("closeItSkillModal").click();
    };

    // =========================
    // Delete Skill
    // =========================
    const deleteSkill = async (id) => {
        if (!window.confirm("Delete this skill?")) return;

        await fetch(`http://127.0.0.1:8000/api/it-skills/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        fetchSkills();
    };

    return (
        <>
            {/* Panel Header */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">IT Skills</h4>
                <a
                    data-bs-toggle="modal"
                    href="#IT_skills"
                    role="button"
                    title="Edit"
                    className="site-text-primary"
                    onClick={openAddModal}
                >
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* Panel Body */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>
                        Mention your employment detail including your current and previous company work experience
                    </p>

                    <div className="table-responsive">
                        <table className="table twm-table table-striped table-borderless">
                            <thead>
                                <tr>
                                    <th>Skills</th>
                                    <th>Version</th>
                                    <th>Last Used</th>
                                    <th>Experience</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {skills.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">No Skills Found</td>
                                    </tr>
                                ) : (
                                    skills.map((skill) => (
                                        <tr key={skill.id}>
                                            <td>{skill.skill_name}</td>
                                            <td>{skill.version || "-"}</td>
                                            <td>{skill.last_used_year || "-"}</td>
                                            <td>
                                                {skill.experience_years || 0} Year{" "}
                                                {skill.experience_months || 0} Month
                                            </td>
                                            <td>
                                                <a
                                                    data-bs-toggle="modal"
                                                    href="#IT_skills"
                                                    role="button"
                                                    title="Edit"
                                                    className="site-text-primary"
                                                    onClick={() => openEditModal(skill)}
                                                >
                                                    <span className="fa fa-edit" />
                                                </a>

                                                <a
                                                    href="#"
                                                    className="text-danger ms-2"
                                                    onClick={() => deleteSkill(skill.id)}
                                                >
                                                    <span className="fa fa-trash" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade twm-saved-jobs-view" id="IT_skills" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">IT Skills</h2>
                                <button
                                    type="button"
                                    id="closeItSkillModal"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                />
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="form-group">
                                            <label>IT Skills</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Enter IT Skills"
                                                    value={formData.skill_name}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, skill_name: e.target.value })
                                                    }
                                                />
                                                <i className="fs-input-icon fa fa-address-card" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6">
                                        <div className="form-group">
                                            <label>Version</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={formData.version}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, version: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6">
                                        <div className="form-group">
                                            <label>Last Used (Year)</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={formData.last_used_year}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, last_used_year: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6">
                                        <div className="form-group">
                                            <label>Experience Year</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={formData.experience_years}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, experience_years: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6">
                                        <div className="form-group">
                                            <label>Month</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={formData.experience_months}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, experience_months: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">
                                    Close
                                </button>

                                <button type="button" className="site-button" onClick={saveSkill}>
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

export default SectionCanITSkills;
