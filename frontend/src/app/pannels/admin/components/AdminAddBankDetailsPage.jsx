import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function AdminAddBankDetailsPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const editId = state?.editId;

    const [formData, setFormData] = useState({
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
            axios.get(`http://localhost:8000/api/bank-details/${editId}/`)
                .then(res => setFormData(res.data))
                .catch(err => console.error("Failed to load data", err));
        }
    }, [editId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const apiCall = editId
            ? axios.put(`http://localhost:8000/api/bank-details/${editId}/`, formData)
            : axios.post("http://localhost:8000/api/bank-details/", formData);

        apiCall
            .then(() => {
                alert(editId ? "Updated Successfully" : "Created Successfully");
                navigate("/admin/bank-details");
            })
            .catch(() => alert("Error saving data"));
    };

    return (
        <div className="panel panel-default p-a20">
            <h3>{editId ? "Edit Bank Details" : "Add Bank Details"}</h3>

            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div className="form-group" key={key}>
                        <label>{key.replace(/_/g, " ").toUpperCase()}:</label>
                        <input
                            type="text"
                            name={key}
                            className="form-control"
                            value={formData[key]}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <button className="btn btn-primary m-r10">Submit</button>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            </form>
        </div>
    );
}

export default AdminAddBankDetailsPage;
