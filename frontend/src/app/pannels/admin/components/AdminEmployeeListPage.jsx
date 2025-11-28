import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
    const navigate = useNavigate();  
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.get(
                "http://localhost:8000/api/employee-list/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    // Dropdown click handlers
    const handleBank = (id) => alert("Bank details for employee = " + id);
    const handleDocs = (id) => alert("Documents for employee = " + id);
    const handleSalary = (id) => alert("Salary details for employee = " + id);

    return (
        <>
            {/* HEADER */}
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Employees</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Employee Listing</span>
                </div>
            </div>

            {/* PANEL */}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-users" /> Employee List
                    </h4>
                </div>

                <div className="panel-body wt-panel-body p-a20 m-b30">

                    {/* TABLE */}
                    <div className="twm-D_table p-a20 table-responsive">
                        <table className="table table-bordered twm-bookmark-list-wrap">
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th style={{ width: "150px" }}>Options</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">Loading...</td>
                                    </tr>
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">No employees found.</td>
                                    </tr>
                                ) : (
                                    employees.map((emp, index) => (
                                        <tr key={emp.id}>
                                            <td>{index + 1}</td>
                                            <td style={{ color: "black" }}>{emp.employee_code}</td>
                                            <td style={{ color: "black" }}>{emp.name}</td>
                                            <td style={{ color: "black" }}>{emp.phone}</td>
                                            <td style={{ color: "black" }}>{emp.email}</td>
                                            <td style={{ color: "black" }}>{emp.department_name}</td>
                                            <td style={{ color: "black" }}>{emp.designation_name}</td>

                                            {/* OPTIONS DROPDOWN */}
                                            <td className="text-center">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-light dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        style={{
                                                            background: "#eef0ff",
                                                            borderRadius: "8px",
                                                            border: "1px solid #ccc",
                                                            padding: "6px 14px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        Options
                                                    </button>

                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => navigate(`/admin/add-bank-details/${emp.id}`)}
                                                        >
                                                                Bank Details
                                                            </button>
                                                        </li>

                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() =>navigate(`/admin/employee-documents/${emp.id}`)}
                                                            >
                                                                Documents
                                                            </button>
                                                        </li>

                                                        
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Options</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeList;
