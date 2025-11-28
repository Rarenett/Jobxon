import { useState, useEffect } from "react";
import axios from "axios";

function EmployeeRegistration() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        department: "",
        designation: "",
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(false);

    const debugLogResponse = (label, res) => {
        console.log(`======== ${label} RESPONSE ========`);
        if (!res) {
            console.log("NO RESPONSE");
            return;
        }
        console.log("STATUS:", res.status);
        console.log("DATA:", res.data);
        console.log("====================================");
    };

    const normalizeList = (payload) => {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (payload.results) return payload.results;
        if (payload.data) return payload.data;
        if (payload.items) return payload.items;
        if (payload.departments) return payload.departments;
        if (payload.designations) return payload.designations;
        return [];
    };

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) return null;

            const res = await axios.post("http://localhost:8000/api/token/refresh/", {
                refresh: refreshToken,
            });

            localStorage.setItem("access_token", res.data.access);
            return res.data.access;
        } catch (err) {
            console.log("TOKEN REFRESH FAILED");
            return null;
        }
    };

    const authFetch = async (url) => {
        try {
            const token = localStorage.getItem("access_token");
            return await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            if (err.response?.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    return await axios.get(url, {
                        headers: { Authorization: `Bearer ${newToken}` },
                    });
                }
            }
            throw err;
        }
    };

    const loadDepartments = async () => {
        const url = "http://localhost:8000/api/departments/";

        try {
            const res = await authFetch(url);
            debugLogResponse("DEPARTMENTS", res);
            setDepartments(normalizeList(res.data));
        } catch (err) {
            console.error("DEPT ERROR:", err.response?.data || err.message);

            try {
                const res2 = await axios.get(url);
                debugLogResponse("DEPARTMENTS (NO AUTH)", res2);
                setDepartments(normalizeList(res2.data));
            } catch (err2) {
                console.error("DEPARTMENTS FAILED COMPLETELY");
            }
        }
    };

    const loadDesignations = async () => {
        const url = "http://localhost:8000/api/designations/";

        try {
            const res = await authFetch(url);
            debugLogResponse("DESIGNATIONS", res);
            setDesignations(normalizeList(res.data));
        } catch (err) {
            console.error("DESIG ERROR:", err.response?.data || err.message);

            try {
                const res2 = await axios.get(url);
                debugLogResponse("DESIGNATIONS (NO AUTH)", res2);
                setDesignations(normalizeList(res2.data));
            } catch (err2) {
                console.error("DESIGNATIONS FAILED COMPLETELY");
            }
        }
    };

    useEffect(() => {
        loadDepartments();
        loadDesignations();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let token = localStorage.getItem("access_token");

            await axios.post(
                "http://localhost:8000/api/add/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Employee registered!");

            setFormData({
                name: "",
                phone: "",
                email: "",
                password: "",
                department: "",
                designation: "",
            });
        } catch (error) {
            if (error.response?.status === 401) {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    await axios.post(
                        "http://localhost:8000/api/add/",
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    alert("Employee registered!");

                    setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        password: "",
                        department: "",
                        designation: "",
                    });

                    setLoading(false);
                    return;
                }
            }

            console.log("REGISTER ERROR:", error.response?.data);
            alert("Failed to register employee");
        }

        setLoading(false);
    };

    return (
        <div className="card p-4 mt-4" style={{ maxWidth: "1500px", margin: "0 auto" }}>
            <h2>Add New Employee</h2>

            <form onSubmit={handleSubmit}>

                {/* NAME + PHONE */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* EMAIL + PASSWORD */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            autoComplete="new-email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* DEPARTMENT + DESIGNATION */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>Department</label>
                        <select
                            className="form-control"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>Designation</label>
                        <select
                            className="form-control"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Designation</option>
                            {designations.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* SUBMIT BUTTON CENTERED */}
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? "Registering..." : "Register Employee"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeRegistration;
