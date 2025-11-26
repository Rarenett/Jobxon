import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function AdminManageDocumentTypesPage() {

    const [documentTypes, setDocumentTypes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    useEffect(() => {
        fetchDocumentTypes();
    }, []);

    const fetchDocumentTypes = async () => {
        try {
            const res = await axios.get(`${API_URL}/document-types/`);
            setDocumentTypes(res.data);
        } catch (err) {
            alert("Failed to load Document Types.");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert("Document Name is required");
            return;
        }

        if (editId) {
            await axios.put(`${API_URL}/document-types/${editId}/`, form);
            alert("Updated Successfully");
        } else {
            await axios.post(`${API_URL}/document-types/`, form);
            alert("Created Successfully");
        }

        setForm({ name: "", description: "" });
        setEditId(null);
        setShowForm(false);
        fetchDocumentTypes();
    };

    const handleEdit = (item) => {
        setForm({
            name: item.name,
            description: item.description || ""
        });
        setEditId(item.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete?")) return;
        await axios.delete(`${API_URL}/document-types/${id}/`);
        alert("Deleted Successfully");
        fetchDocumentTypes();
    };

    const handleCancel = () => {
        setForm({ name: "", description: "" });
        setEditId(null);
        setShowForm(false);
    };

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Document Types</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Document Types</span>
                </div>
            </div>

            {/* Add Document Button */}
            {!showForm && (
                <div className="mb-4">
                    <button className="site-button" onClick={() => setShowForm(true)}>
                        <i className="fa fa-plus"></i> Add Document Type
                    </button>
                </div>
            )}

            {/* Add / Edit Form */}
            {showForm && (
                <div className="panel panel-default site-bg-white">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0">
                            <i className="fa fa-edit"></i>
                            {editId ? " Edit Document Type" : " Add Document Type"}
                        </h4>
                    </div>

                    <div className="panel-body wt-panel-body p-a20">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Document Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Enter Document Name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group mt-3">
                                <label>Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    placeholder="Enter description"
                                    value={form.description}
                                    rows={3}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="mt-3">
                                <button type="submit" className="site-button m-r5">
                                    {editId ? "Update Document Type" : "Add Document Type"}
                                </button>

                                <button
                                    type="button"
                                    className="site-button outline-primary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Document Types Table */}
            <div className="panel panel-default site-bg-white m-t30">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-file"></i> All Document Types ({documentTypes.length})
                    </h4>
                </div>

                <div className="panel-body wt-panel-body p-a20">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Document Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {documentTypes.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4">
                                            No Document Types Found
                                        </td>
                                    </tr>
                                ) : (
                                    documentTypes.map((doc, index) => (
                                        <tr key={doc.id}>
                                            <td>{index + 1}</td>
                                            <td><b>{doc.name}</b></td>
                                            <td>{doc.description || "-"}</td>
                                            <td>
                                            <button
                                                style={{background: "#eef5ff",
                                                        border: "none",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        cursor: "pointer"
                                                        }}
                                                onClick={() => handleEdit(doc.id)}>
                                                <i className="fa fa-edit" style={{ color: "#1375ed" }} />
                                            </button>


                                            <button
                                                style={{background: "#eef5ff",
                                                        border: "none",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        cursor: "pointer"
                                                        }}
                                                    onClick={() => handleDelete(doc.id)}
>
                                                <i className="fa fa-trash" style={{ color: "#1375ed" }} />
                                            </button>


                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Document Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminManageDocumentTypesPage;
