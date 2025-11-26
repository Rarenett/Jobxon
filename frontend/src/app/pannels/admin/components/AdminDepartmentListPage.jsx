import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function AdminDepartmentListPage() {
    const [departments, setDepartments] = useState([]);

    const [showDeptForm, setShowDeptForm] = useState(false);
    const [showDesigForm, setShowDesigForm] = useState(false);

    const [editDeptId, setEditDeptId] = useState(null);
    const [editDesigId, setEditDesigId] = useState(null);

    const [deptForm, setDeptForm] = useState({ name: "", description: "" });

    const [desigForm, setDesigForm] = useState({
        department: "",
        name: "",
        description: ""
    });

    const [openDeptId, setOpenDeptId] = useState(null);

    const toggleDepartment = (id) => {
        setOpenDeptId(openDeptId === id ? null : id);
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        const res = await axios.get(`${API_URL}/departments/`);
        setDepartments(res.data);
    };

    const submitDepartment = async (e) => {
        e.preventDefault();

        if (editDeptId) {
            await axios.put(`${API_URL}/departments/${editDeptId}/`, deptForm);
            alert("Department Updated");
        } else {
            await axios.post(`${API_URL}/departments/`, deptForm);
            alert("Department Created");
        }

        resetDeptForm();
        loadDepartments();
    };

    const resetDeptForm = () => {
        setDeptForm({ name: "", description: "" });
        setEditDeptId(null);
        setShowDeptForm(false);
    };

    const submitDesignation = async (e) => {
        e.preventDefault();

        if (editDesigId) {
            await axios.put(`${API_URL}/designations/${editDesigId}/`, desigForm);
            alert("Designation Updated");
        } else {
            await axios.post(`${API_URL}/designations/`, desigForm);
            alert("Designation Added");
        }

        resetDesigForm();
        loadDepartments();
    };

    const resetDesigForm = () => {
        setDesigForm({ department: "", name: "", description: "" });
        setEditDesigId(null);
        setShowDesigForm(false);
    };

    return (
        <>
            <h3 className="mb-3" style={{ color: "#1375ed", fontWeight: "700" }}>
                Department List
            </h3>

            <button className="site-button mb-4" onClick={() => setShowDeptForm(true)}>
                <i className="fa fa-plus"></i> Department
            </button>

            {showDeptForm && (
                <div className="panel panel-default p-a20 mb-4">
                    <h4 style={{ color: "#1375ed" }}>
                        {editDeptId ? "Edit Department" : "Add Department"}
                    </h4>

                    <form onSubmit={submitDepartment}>
                        <div className="form-group mt-2">
                            <label>Department Name</label>
                            <input
                                className="form-control"
                                value={deptForm.name}
                                onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={deptForm.description}
                                onChange={(e) =>
                                    setDeptForm({ ...deptForm, description: e.target.value })
                                }
                            ></textarea>
                        </div>

                        <button className="site-button mt-3">Save</button>
                        <button
                            type="button"
                            className="site-button outline-primary mt-3 ml-2"
                            onClick={resetDeptForm}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div className="row">
                {departments.map((dept) => (
                    <div key={dept.id} className="col-md-4 mb-4">
                        <div
                            className="p-3 shadow-sm"
                            style={{
                                background: "#fff",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                            onClick={() => toggleDepartment(dept.id)}
                        >
                            <div className="d-flex justify-content-between align-items-center">

                                {/* BLUE TITLE */}
                                <h5
                                    className="m-0"
                                    style={{ color: "#1375ed", fontWeight: "600" }}
                                >
                                    <i
                                        className="fa fa-building"
                                        style={{
                                            color: "#1375ed",
                                            marginRight: "6px"
                                        }}
                                    ></i>
                                    {dept.name}
                                </h5>

                                <div style={{ display: "flex", gap: "10px" }}>

                                    {/* EDIT DEP */}
                                    <button
                                        style={{
                                            background: "#eef5ff",
                                            border: "none",
                                            padding: "8px",
                                            borderRadius: "8px",
                                            cursor: "pointer"
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeptForm({
                                                name: dept.name,
                                                description: dept.description
                                            });
                                            setEditDeptId(dept.id);
                                            setShowDeptForm(true);
                                        }}
                                    >
                                        <i
                                            className="fa fa-edit"
                                            style={{ color: "#1375ed" }}
                                        />
                                    </button>

                                    {/* DELETE DEP */}
                                    <button
                                        style={{
                                            background: "#eef5ff",
                                            border: "none",
                                            padding: "8px",
                                            borderRadius: "8px",
                                            cursor: "pointer"
                                        }}
                                        onClick={async (e) => {
                                            e.stopPropagation();

                                            if (
                                                !window.confirm(
                                                    `Are you sure you want to delete "${dept.name}"?`
                                                )
                                            )
                                                return;

                                            try {
                                                await axios.delete(
                                                    `${API_URL}/departments/${dept.id}/`
                                                );
                                                alert("Department deleted");
                                                loadDepartments();
                                            } catch (err) {
                                                alert("Failed to delete department");
                                            }
                                        }}
                                    >
                                        <i
                                            className="fa fa-trash"
                                            style={{ color: "#1375ed" }}
                                        />
                                    </button>
                                </div>
                            </div>

                            {openDeptId === dept.id && (
                                <div className="mt-3">

                                    {dept.designations.map((desig) => (
                                        <div
                                            key={desig.id}
                                            className="d-flex justify-content-between align-items-center mb-3"
                                        >
                                            {/* BLUE DESIGNATION NAME */}
                                            <span
                                                style={{
                                                color: "#0a0a0aff",
                                                fontWeight: "500"
                                                }}
                                            >
                                            {desig.name}
                                        </span>


                                            <div style={{ display: "flex", gap: "10px" }}>

                                                {/* EDIT DESIGNATION */}
                                                <button
                                                    style={{
                                                        background: "#eef5ff",
                                                        border: "none",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDesigForm({
                                                            department: dept.id,
                                                            name: desig.name,
                                                            description: desig.description
                                                        });
                                                        setEditDesigId(desig.id);
                                                        setShowDesigForm(true);
                                                    }}
                                                >
                                                    <i
                                                        className="fa fa-edit"
                                                        style={{ color: "#1375ed" }}
                                                    />
                                                </button>

                                                {/* DELETE DESIGNATION */}
                                                <button
                                                    style={{
                                                        background: "#eef5ff",
                                                        border: "none",
                                                        padding: "8px",
                                                        borderRadius: "8px",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={async (e) => {
                                                        e.stopPropagation();

                                                        if (
                                                            !window.confirm(
                                                                `Delete designation "${desig.name}"?`
                                                            )
                                                        )
                                                            return;

                                                        try {
                                                            await axios.delete(
                                                                `${API_URL}/designations/${desig.id}/`
                                                            );
                                                            alert("Designation deleted");
                                                            loadDepartments();
                                                        } catch (err) {
                                                            alert("Failed to delete designation");
                                                        }
                                                    }}
                                                >
                                                    <i
                                                        className="fa fa-trash"
                                                        style={{ color: "#1375ed" }}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Designation */}
                                    <button
                                        className="site-button mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDesigForm({
                                                department: dept.id,
                                                name: "",
                                                description: ""
                                            });
                                            setShowDesigForm(true);
                                        }}
                                    >
                                        Add Designation
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showDesigForm && (
                <div className="panel panel-default p-a20 mt-4">
                    <h4 style={{ color: "#1375ed" }}>
                        {editDesigId ? "Edit Designation" : "Add Designation"}
                    </h4>

                    <form onSubmit={submitDesignation}>
                        <div className="form-group mt-2">
                            <label>Designation Name</label>
                            <input
                                className="form-control"
                                value={desigForm.name}
                                onChange={(e) =>
                                    setDesigForm({ ...desigForm, name: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={desigForm.description}
                                onChange={(e) =>
                                    setDesigForm({
                                        ...desigForm,
                                        description: e.target.value
                                    })
                                }
                            ></textarea>
                        </div>

                        <button className="site-button mt-3">Save</button>
                        <button
                            type="button"
                            className="site-button outline-primary mt-3 ml-2"
                            onClick={resetDesigForm}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default AdminDepartmentListPage;
