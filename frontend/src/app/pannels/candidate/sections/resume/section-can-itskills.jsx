import { useEffect, useState } from "react";

function SectionCanITSkills() {
    const [skillsList, setSkillsList] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        skill_name: "",
        version: "",
        last_used_year: "",
        experience_years: "",
        experience_months: ""
    });

    const token = localStorage.getItem("access_token");
    const API_URL = "http://127.0.0.1:8000/api/it-skills/";

    // ✅ Load Skills
    const loadSkills = async () => {
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            const list = Array.isArray(data) ? data : data.results || [];
            setSkillsList(list);

            // refresh bootstrap selectpicker
            setTimeout(() => {
                window.$?.(".selectpicker").selectpicker("refresh");
            }, 200);
        } catch {
            setSkillsList([]);
        }
    };

    useEffect(() => {
        loadSkills();
    }, []);

    // ✅ Open Add
    const openAddModal = () => {
        setFormData({
            id: null,
            skill_name: "",
            version: "",
            last_used_year: "",
            experience_years: "",
            experience_months: ""
        });
    };

    // ✅ Open Edit
    const openEditModal = (skill) => {
        setFormData(skill);
        new window.bootstrap.Modal(document.getElementById("IT_skills")).show();
    };

    // ✅ Handle input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Save
    const saveSkill = async () => {
        const url = formData.id ? `${API_URL}${formData.id}/` : API_URL;
        const method = formData.id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            loadSkills(); // ✅ no reload, keep UI intact
            const modal = window.bootstrap.Modal.getInstance(
                document.getElementById("IT_skills")
            );
            modal?.hide();
        } else {
            const err = await res.json();
            alert(JSON.stringify(err));
        }
    };

    // ✅ Delete
    const deleteSkill = async (id) => {
        if (!window.confirm("Delete this skill?")) return;

        const res = await fetch(`${API_URL}${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            setSkillsList(skillsList.filter(skill => skill.id !== id));
        } else {
            alert("Delete failed ❌");
        }
    };

    return (
        <>
            {/* Header - ORIGINAL STYLE */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">IT Skills</h4>
                <a
                    href="#IT_skills"
                    data-bs-toggle="modal"
                    className="site-text-primary"
                    onClick={openAddModal}
                >
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* Table - ORIGINAL STYLE */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">
                    <p>Mention your employment detail including your current and previous company work experience</p>

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
                                {skillsList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">No skills added</td>
                                    </tr>
                                ) : (
                                    skillsList.map((skill) => (
                                        <tr key={skill.id}>
                                            <td>{skill.skill_name}</td>
                                            <td>{skill.version}</td>
                                            <td>{skill.last_used_year}</td>
                                            <td>
                                                {skill.experience_years} Year {skill.experience_months} Month
                                            </td>
                                            <td>
                                                <a
                                                    href="#IT_skills"
                                                    data-bs-toggle="modal"
                                                    className="site-text-primary me-2"
                                                    onClick={() => openEditModal(skill)}
                                                >
                                                    <span className="fa fa-edit" />
                                                </a>

                                                <a
                                                    className="site-text-primary"
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

            {/* Modal - ORIGINAL TEMPLATE STYLE */}
            <div className="modal fade twm-saved-jobs-view" id="IT_skills" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">IT Skills</h2>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                />
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12 col-lg-12">
                                        <div className="form-group">
                                            <label>IT Skills</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="skill_name"
                                                    value={formData.skill_name}
                                                    onChange={handleChange}
                                                    placeholder="Enter IT Skills"
                                                />
                                                <i className="fs-input-icon fa fa-address-card" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-12">
                                        <div className="form-group">
                                            <label>Version</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="version"
                                                    value={formData.version}
                                                    onChange={handleChange}
                                                    placeholder="Enter Version"
                                                />
                                                <i className="fs-input-icon fa fa-info" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-12">
                                        <div className="form-group">
                                            <label>Last Used Year</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="last_used_year"
                                                    value={formData.last_used_year}
                                                    onChange={handleChange}
                                                    placeholder="Year"
                                                />
                                                <i className="fs-input-icon fa fa-calendar" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-12">
                                        <div className="form-group">
                                            <label>Experience Year</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="experience_years"
                                                    value={formData.experience_years}
                                                    onChange={handleChange}
                                                    placeholder="Years"
                                                />
                                                <i className="fs-input-icon fa fa-user-edit" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-lg-12">
                                        <div className="form-group">
                                            <label>Month</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="experience_months"
                                                    value={formData.experience_months}
                                                    onChange={handleChange}
                                                    placeholder="Months"
                                                />
                                                <i className="fs-input-icon fa fa-user-edit" />
                                            </div>
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
                                    onClick={saveSkill}
                                >
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
