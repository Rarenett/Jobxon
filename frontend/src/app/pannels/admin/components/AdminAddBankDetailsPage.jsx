import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function AdminAddBankDetailsPage() {
    const navigate = useNavigate();
    const { employeeId, editId } = useParams();

    const [formData, setFormData] = useState({
        employee: employeeId || "",
        bank_name: "",
        ifsc_code: "",
        account_no: "",
        mode_of_payment: "",
        pan_no: "",
        uan_no: "",
        esic_no: "",
    });

    useEffect(() => {
        if (editId) {
            axios
                .get(`http://localhost:8000/api/bank-details/${editId}/`)
                .then((res) => setFormData(res.data))
                .catch((err) => console.error("Failed to load data", err));
        }
    }, [editId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const apiCall = editId
            ? axios.put(`http://localhost:8000/api/bank-details/${editId}/`, formData)
            : axios.post("http://localhost:8000/api/bank-details/", formData);

        apiCall
            .then(() => {
                alert(editId ? "Updated Successfully" : "Created Successfully");
                navigate("/admin/list");
            })
            .catch((err) => {
                console.error(err);
                alert("Error saving data");
            });
    };

    return (
        <div className="panel panel-default p-a20">
            <h3>{editId ? "Edit Bank Details" : "Add Bank Details"}</h3>

            <form onSubmit={handleSubmit}>

                <input type="hidden" name="employee" value={formData.employee} />

                <div className="form-group">
                    <label>Bank Name</label>
                    <input
                        type="text"
                        name="bank_name"
                        className="form-control"
                        value={formData.bank_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                        type="text"
                        name="ifsc_code"
                        className="form-control"
                        value={formData.ifsc_code}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Account Number</label>
                    <input
                        type="text"
                        name="account_no"
                        className="form-control"
                        value={formData.account_no}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mode of Payment</label>
                    <input
                        type="text"
                        name="mode_of_payment"
                        className="form-control"
                        value={formData.mode_of_payment}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>PAN Number</label>
                    <input
                        type="text"
                        name="pan_no"
                        className="form-control"
                        value={formData.pan_no}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>UAN Number</label>
                    <input
                        type="text"
                        name="uan_no"
                        className="form-control"
                        value={formData.uan_no}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>ESIC Number</label>
                    <input
                        type="text"
                        name="esic_no"
                        className="form-control"
                        value={formData.esic_no}
                        onChange={handleChange}
                    />
                </div>

                <button className="btn btn-primary m-r10">
                    {editId ? "Update" : "Submit"}
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </form>
        </div>
    );
}

export default AdminAddBankDetailsPage;
