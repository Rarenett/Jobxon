import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminManageBankDetailsPage() {

    const [bankDetails, setBankDetails] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/bank-details/")
            .then((res) => setBankDetails(res.data))
            .catch((err) => console.error("Error loading bank details", err));
    }, []);

    const handleEdit = (id) => {
        navigate("/admin/bank-details/add", { state: { editId: id } });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure to delete?")) return;

        axios.delete(`http://localhost:8000/api/bank-details/${id}/`)
            .then(() => {
                alert("Deleted Successfully");
                setBankDetails(bankDetails.filter(item => item.id !== id));
            })
            .catch(err => alert("Delete Failed"));
    };

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Bank Details</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Bank Details Listing</span>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-bank" /> Bank Details List
                    </h4>
                </div>

                <div className="panel-body wt-panel-body p-a20 m-b30">
                    <div className="twm-D_table p-a20 table-responsive">
                        <table className="table table-bordered twm-bookmark-list-wrap">
                            <thead>
                                <tr>
                                    <th>Sl.No</th>
                                    <th>Bank Name</th>
                                    <th>Account No</th>
                                    <th style={{ width: "150px" }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bankDetails.map((b, index) => (
                                    <tr key={b.id}>
                                        <td>{index + 1}</td>
                                        <td>{b.bank_name}</td>
                                        <td>{b.account_no}</td>

                                        <td className="text-center">
                                            <div style={{
                                                display: "flex",
                                                gap: "10px",
                                                justifyContent: "center"
                                            }}>
                                                <button
                                                    style={{ background: "#eef5ff", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                                                    onClick={() => handleEdit(b.id)}
                                                >
                                                    <i className="fa fa-edit" style={{ color: "#1375ed" }} />
                                                </button>

                                                <button
                                                    style={{ background: "#eef5ff", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer" }}
                                                    onClick={() => handleDelete(b.id)}
                                                >
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
                                    <th>Bank Name</th>
                                    <th>Account No</th>
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

export default AdminManageBankDetailsPage;
