import { useEffect, useState } from "react";
import axios from "axios";

function AdminManageJobTypesPage() {

    const [jobTypes, setJobTypes] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/job-type/")
            .then((res) => setJobTypes(res.data))
            .catch((err) => console.error("Error loading job types", err));
    }, []);

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Job Types</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Job Type Listing</span>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-tag" /> Job Type List
                    </h4>
                </div>

                <div className="panel-body wt-panel-body p-a20 m-b30">
                    <div className="twm-D_table p-a20 table-responsive">
                        <table className="table table-bordered twm-bookmark-list-wrap">
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Job Type</th>
                                    <th style={{ width: "150px" }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {jobTypes.map((jt, index) => (
                                    <tr key={jt.id}>
                                        <td>{index + 1}</td>
                                        <td>{jt.name}</td>

                                        <td className="text-center">

                                            {/* ACTION BUTTONS */}
                                            <div style={{
                                                display: "flex",
                                                gap: "10px",
                                                justifyContent: "center"
                                            }}>
                                                {/* EDIT */}
                                                <button style={{
                                                    background: "#eef5ff",
                                                    border: "none",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer"
                                                }}>
                                                    <i className="fa fa-edit" style={{ color: "#1375ed" }} />
                                                </button>

                                                {/* DELETE */}
                                                <button style={{
                                                    background: "#eef5ff",
                                                    border: "none",
                                                    padding: "8px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer"
                                                }}>
                                                    <i className="fa fa-trash" style={{ color: "#1375ed" }} />
                                                </button>
                                            </div>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Job Type</th>
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

export default AdminManageJobTypesPage;
