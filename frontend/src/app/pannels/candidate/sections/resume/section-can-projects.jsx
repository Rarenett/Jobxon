import { useEffect, useState } from "react";

function SectionCanProjects() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        project_title: "",
        client: "",
        status: "Finished",
        start_date: "",
        end_date: "",
        description: ""
    });
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("access_token");
    const API_URL = "http://127.0.0.1:8000/api/projects/";

    const loadProjects = async () => {
        try {
            const res = await fetch(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (Array.isArray(data)) setProjects(data);
            else if (data?.results) setProjects(data.results);
            else setProjects([]);
        } catch {
            setProjects([]);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveProject = async () => {
        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API_URL}${editId}/` : API_URL;

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            loadProjects();
            resetForm();
            window.bootstrap.Modal.getInstance(document.getElementById("Pro_ject"))?.hide();
        } else {
            const err = await res.json();
            alert(JSON.stringify(err));
        }
    };

    const editProject = (proj) => {
        setFormData({
            project_title: proj.project_title || "",
            client: proj.client || "",
            status: proj.status || "Finished",
            start_date: proj.start_date || "",
            end_date: proj.end_date || "",
            description: proj.description || ""
        });

        setEditId(proj.id);
        new window.bootstrap.Modal(document.getElementById("Pro_ject")).show();
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        await fetch(`${API_URL}${id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        setProjects(projects.filter(p => p.id !== id));
    };

    const resetForm = () => {
        setFormData({
            project_title: "",
            client: "",
            status: "Finished",
            start_date: "",
            end_date: "",
            description: ""
        });
        setEditId(null);
    };

    return (
        <>
            {/* Header */}
            <div className="panel-heading wt-panel-heading p-a20 panel-heading-with-btn ">
                <h4 className="panel-tittle m-a0">Project</h4>
                <a
                    className="site-text-primary"
                    data-bs-toggle="modal"
                    href="#Pro_ject"
                    onClick={resetForm}
                >
                    <span className="fa fa-edit" />
                </a>
            </div>

            {/* List - ORIGINAL LAYOUT */}
            <div className="panel-body wt-panel-body p-a20 ">
                <div className="twm-panel-inner">

                    {projects.length === 0 ? (
                        <p>No projects added</p>
                    ) : (
                        projects.map((p) => (
                            <div key={p.id} className="mb-3">
                                <p><b>{p.project_title}</b></p>
                                <p>{p.client}</p>
                                <p>
                                    {p.start_date} to {p.end_date || "Present"}
                                </p>
                                <p>{p.description}</p>

                                <a
                                    className="site-text-primary me-2"
                                    href="#Pro_ject"
                                    data-bs-toggle="modal"
                                    onClick={() => editProject(p)}
                                >
                                    <span className="fa fa-edit" />
                                </a>

                                <a
                                    className="site-text-primary"
                                    onClick={() => deleteProject(p.id)}
                                >
                                    <span className="fa fa-trash" />
                                </a>

                                <hr />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal - ORIGINAL DESIGN */}
            <div className="modal fade twm-saved-jobs-view" id="Pro_ject" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {editId ? "Edit Project" : "Add Project"}
                                </h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>

                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="form-group">
                                            <label>Project Title</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    name="project_title"
                                                    value={formData.project_title}
                                                    onChange={handleChange}
                                                    placeholder="Enter Project Title"
                                                />
                                                <i className="fs-input-icon fa fa-address-card" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12">
                                        <div className="form-group">
                                            <label>Client</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    className="form-control"
                                                    name="client"
                                                    value={formData.client}
                                                    onChange={handleChange}
                                                    placeholder="Enter Client Name"
                                                />
                                                <i className="fs-input-icon fa fa-user" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-12">
                                        <div className="form-group">
                                            <label>Project Status</label>
                                            <div className="row twm-form-radio-inline">
                                                <div className="col-md-6">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="In Progress"
                                                        checked={formData.status === "In Progress"}
                                                        onChange={handleChange}
                                                    />
                                                    <label>In Progress</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value="Finished"
                                                        checked={formData.status === "Finished"}
                                                        onChange={handleChange}
                                                    />
                                                    <label>Finished</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Started Working From</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="start_date"
                                                    value={formData.start_date}
                                                    onChange={handleChange}
                                                />
                                                <i className="fs-input-icon far fa-calendar" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Worked Till</label>
                                            <div className="ls-inputicon-box">
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="end_date"
                                                    value={formData.end_date}
                                                    onChange={handleChange}
                                                />
                                                <i className="fs-input-icon far fa-calendar" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-0">
                                            <label>Detail of Projects</label>
                                            <textarea
                                                className="form-control"
                                                rows={3}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Describe your project"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="site-button" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="site-button" onClick={saveProject}>
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

export default SectionCanProjects;
