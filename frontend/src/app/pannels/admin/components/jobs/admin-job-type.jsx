import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAddJobTypePage() {
    const [name, setName] = useState("");
    const navigate = useNavigate();   // <-- for redirect

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);

        axios.post("http://localhost:8000/api/job-type/", formData)
            .then(() => {
                alert("Job Type Added Successfully");
                setName("");

                // ✅ redirect to job-type list page
                navigate("/admin/job-type-list");  
            })
            .catch((err) => {
                console.error(err);
                alert("Error adding job type");
            });
    };

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Add Job Type</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Add Job Type</span>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-file-alt" /> Add New Job Type
                    </h4>
                </div>

                <div className="panel-body wt-panel-body p-a20 m-b30">
                    <form onSubmit={handleSubmit}>
                        <div className="row">

                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Job Type Name</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Job Type (e.g., Full Time)"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                        <i className="fs-input-icon fa fa-tag" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-12 col-md-12">
                                <div className="text-left mt-3">
                                    <button type="submit" className="site-button">
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AdminAddJobTypePage;
