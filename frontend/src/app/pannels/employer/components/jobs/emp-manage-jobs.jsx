import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";

function EmpManageJobsPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);

    // edit form state (panel at top)
    const [editingJobId, setEditingJobId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        category: "",
        job_type: "",
        work_mode: "Onsite",
        salary_range: "",
        experience: "",
        qualification: "",
        requirements: "",
        responsibilities: "",
        skills_required: "",
        gender: "",
        country: "",
        city: "",
        location: "",
        latitude: "",
        longitude: "",
        email: "",
        website: "",
        est_since: "",
        complete_address: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    // Fetch employer's jobs + dropdown data
    useEffect(() => {
        if (!token) {
            alert("Please log in to view your jobs.");
            return;
        }

        const fetchAll = async () => {
            try {
                const [jobsRes, catRes, typeRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/jobs/my-jobs/", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://127.0.0.1:8000/api/categories/"),
                    axios.get("http://127.0.0.1:8000/api/job-type/"),
                ]);
                setJobs(jobsRes.data);
                setCategories(catRes.data);
                setJobTypes(typeRes.data);
                setLoading(false);
                console.log("Jobs loaded:", jobsRes.data);
            } catch (err) {
                console.error("Error loading data:", err);
                setLoading(false);
            }
        };

        fetchAll();
    }, [token]);

    // Delete job handler
    const handleDelete = async (jobId, jobTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
            return;
        }

        try {
            await axios.delete(`http://127.0.0.1:8000/api/jobs/${jobId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Job deleted successfully!");
            setJobs((prev) => prev.filter((job) => job.id !== jobId));
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Failed to delete job. Please try again.");
        }
    };

    // View job handler
    const handleView = (slug) => {
        navigate(`/job-detail/${slug}`);
    };

    // Open edit form panel with selected job data
    const handleOpenEditForm = (job) => {
        setEditingJobId(job.id);
        setEditForm({
            title: job.title || "",
            category: job.category || "",
            job_type: job.job_type || "",
            work_mode: job.work_mode || "Onsite",
            salary_range: job.salary_range || "",
            experience: job.experience || "",
            qualification: job.qualification || "",
            requirements: job.requirements || "",
            responsibilities: job.responsibilities || "",
            skills_required: job.skills_required || "",
            gender: job.gender || "",
            country: job.country || "",
            city: job.city || "",
            location: job.location || "",
            latitude: job.latitude || "",
            longitude: job.longitude || "",
            email: job.email || "",
            website: job.website || "",
            est_since: job.est_since || "",
            complete_address: job.complete_address || "",
            description: job.description || "",
            start_date: job.start_date || "",
            end_date: job.end_date || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // Save edit (PUT)
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingJobId) return;

        try {
            const payload = {
                ...editForm,
                category: editForm.category ? parseInt(editForm.category) : null,
                job_type: editForm.job_type ? parseInt(editForm.job_type) : null,
                start_date: editForm.start_date || null,
                end_date: editForm.end_date || null,
            };

            const res = await axios.put(
                `http://127.0.0.1:8000/api/jobs/${editingJobId}/`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Update local list
            setJobs((prev) =>
                prev.map((job) => (job.id === editingJobId ? res.data : job))
            );
            alert("Job updated successfully!");
            setEditingJobId(null);
        } catch (err) {
            console.error("Error updating job:", err.response?.data || err);
            alert("Failed to update job.");
        }
    };

    const handleCancelEdit = () => {
        setEditingJobId(null);
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Get job type badge color
    const getJobTypeBadge = (jobType) => {
        const colors = {
            "Full Time": "twm-bg-purple",
            "Full time": "twm-bg-purple",
            "Part Time": "twm-bg-green",
            Freelance: "twm-bg-sky",
            Internship: "twm-bg-brown",
            Temporary: "twm-bg-golden",
        };
        return colors[jobType] || "twm-bg-green";
    };

    // Get work mode badge color
    const getWorkModeBadge = (workMode) => {
        const colors = {
            Remote: { bg: "#10b981", text: "#ffffff" },
            Onsite: { bg: "#3b82f6", text: "#ffffff" },
            Hybrid: { bg: "#f59e0b", text: "#ffffff" },
        };
        return colors[workMode] || { bg: "#6b7280", text: "#ffffff" };
    };

    if (loading) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Jobs</h2>
                <p>Loading your jobs...</p>
            </div>
        );
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Manage Jobs</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>My Job Listing</span>
                </div>
            </div>

            {/* EDIT FORM PANEL (only visible when editingJobId is set) */}
            {editingJobId && (
                <div className="panel panel-default m-b30">
                    <div className="panel-heading wt-panel-heading p-a20 d-flex justify-content-between align-items-center">
                        <h4 className="panel-tittle m-a0">
                            <i className="fa fa-edit" /> Edit Job
                        </h4>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleCancelEdit}
                        >
                            Close
                        </button>
                    </div>
                    <div className="panel-body wt-panel-body p-a20">
                        <form onSubmit={handleSaveEdit} autoComplete="off">
                            <div className="row">
                                {/* Job title */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Job Title</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="title"
                                                className="form-control"
                                                type="text"
                                                placeholder="Job Title"
                                                value={editForm.title}
                                                onChange={handleEditFormChange}
                                                required
                                            />
                                            <i className="fs-input-icon fa fa-address-card" />
                                        </div>
                                    </div>
                                </div>

                                {/* Job Category */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group city-outer-bx has-feedback">
                                        <label>Job Category</label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="category"
                                                className="form-control"
                                                value={editForm.category || ""}
                                                onChange={handleEditFormChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Category
                                                </option>
                                                {categories.map((c) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="fs-input-icon fa fa-border-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Job Type</label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="job_type"
                                                className="form-control"
                                                value={editForm.job_type || ""}
                                                onChange={handleEditFormChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Type
                                                </option>
                                                {jobTypes.map((jt) => (
                                                    <option
                                                        key={jt.id}
                                                        value={jt.id}
                                                    >
                                                        {jt.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <i className="fs-input-icon fa fa-file-alt" />
                                        </div>
                                    </div>
                                </div>

                                {/* Work Mode */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Work Mode</label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="work_mode"
                                                className="form-control"
                                                value={editForm.work_mode}
                                                onChange={handleEditFormChange}
                                                required
                                            >
                                                <option value="Onsite">
                                                    Onsite
                                                </option>
                                                <option value="Remote">
                                                    Remote
                                                </option>
                                                <option value="Hybrid">
                                                    Hybrid
                                                </option>
                                            </select>
                                            <i className="fs-input-icon fa fa-laptop-house" />
                                        </div>
                                    </div>
                                </div>

                                {/* Salary Range */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Salary Range</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="salary_range"
                                                className="form-control"
                                                type="text"
                                                placeholder="e.g. 30000-40000"
                                                value={editForm.salary_range}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-dollar-sign" />
                                        </div>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Experience</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="experience"
                                                className="form-control"
                                                type="text"
                                                placeholder="E.g. Minimum 3 years"
                                                value={editForm.experience}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-user-edit" />
                                        </div>
                                    </div>
                                </div>

                                {/* Qualification */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Qualification</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="qualification"
                                                className="form-control"
                                                type="text"
                                                placeholder="Qualification Title"
                                                value={editForm.qualification}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-user-graduate" />
                                        </div>
                                    </div>
                                </div>

                                {/* Gender */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="gender"
                                                className="form-control"
                                                value={editForm.gender}
                                                onChange={handleEditFormChange}
                                                required
                                            >
                                                <option value="">
                                                    Gender
                                                </option>
                                                <option value="Male">Male</option>
                                                <option value="Female">
                                                    Female
                                                </option>
                                                <option value="Other">
                                                    Other
                                                </option>
                                                <option value="Any">Any</option>
                                            </select>
                                            <i className="fs-input-icon fa fa-venus-mars" />
                                        </div>
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Country</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="country"
                                                className="form-control"
                                                type="text"
                                                placeholder="Country"
                                                value={editForm.country}
                                                onChange={handleEditFormChange}
                                                required
                                            />
                                            <i className="fs-input-icon fa fa-globe-americas" />
                                        </div>
                                    </div>
                                </div>

                                {/* City */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>City</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="city"
                                                className="form-control"
                                                type="text"
                                                placeholder="City"
                                                value={editForm.city}
                                                onChange={handleEditFormChange}
                                                required
                                            />
                                            <i className="fs-input-icon fa fa-map-marker-alt" />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Location</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="location"
                                                className="form-control"
                                                type="text"
                                                placeholder="Type Address"
                                                value={editForm.location}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-map-marker-alt" />
                                        </div>
                                    </div>
                                </div>

                                {/* Latitude */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Latitude</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="latitude"
                                                className="form-control"
                                                type="text"
                                                placeholder="Latitude"
                                                value={editForm.latitude}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-map-pin" />
                                        </div>
                                    </div>
                                </div>

                                {/* Longitude */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Longitude</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="longitude"
                                                className="form-control"
                                                type="text"
                                                placeholder="Longitude"
                                                value={editForm.longitude}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-map-pin" />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="email"
                                                className="form-control"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={editForm.email}
                                                onChange={handleEditFormChange}
                                                required
                                            />
                                            <i className="fs-input-icon fas fa-at" />
                                        </div>
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Website</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="website"
                                                className="form-control"
                                                type="url"
                                                placeholder="https://..."
                                                value={editForm.website}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-globe-americas" />
                                        </div>
                                    </div>
                                </div>

                                {/* Est. Since */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Est. Since</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="est_since"
                                                className="form-control"
                                                type="text"
                                                placeholder="Since..."
                                                value={editForm.est_since}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-clock" />
                                        </div>
                                    </div>
                                </div>

                                {/* Complete Address */}
                                <div className="col-xl-12 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Complete Address</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="complete_address"
                                                className="form-control"
                                                type="text"
                                                placeholder="Full address here..."
                                                value={editForm.complete_address}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon fa fa-home" />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows={3}
                                            placeholder="Job description"
                                            value={editForm.description}
                                            onChange={handleEditFormChange}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Requirements</label>
                                        <textarea
                                            name="requirements"
                                            className="form-control"
                                            rows={3}
                                            placeholder="List job requirements..."
                                            value={editForm.requirements}
                                            onChange={handleEditFormChange}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Responsibilities */}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Responsibilities</label>
                                        <textarea
                                            name="responsibilities"
                                            className="form-control"
                                            rows={3}
                                            placeholder="List job responsibilities..."
                                            value={editForm.responsibilities}
                                            onChange={handleEditFormChange}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Skills Required */}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Skills Required</label>
                                        <textarea
                                            name="skills_required"
                                            className="form-control"
                                            rows={3}
                                            placeholder="List required skills..."
                                            value={editForm.skills_required}
                                            onChange={handleEditFormChange}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Start Date */}
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="start_date"
                                                className="form-control"
                                                type="date"
                                                value={editForm.start_date || ""}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon far fa-calendar" />
                                        </div>
                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="end_date"
                                                className="form-control"
                                                type="date"
                                                value={editForm.end_date || ""}
                                                onChange={handleEditFormChange}
                                            />
                                            <i className="fs-input-icon far fa-calendar" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-12 col-md-12">
                                    <div className="text-left">
                                        <button
                                            type="submit"
                                            className="site-button m-r5"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            className="site-button outline-primary"
                                            onClick={handleCancelEdit}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* JOBS TABLE */}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-suitcase" /> Job Details
                        <span className="badge bg-primary ms-2">
                            {jobs.length} Jobs
                        </span>
                    </h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30">
                    {jobs.length === 0 ? (
                        <div className="text-center p-5">
                            <i className="fa fa-briefcase fa-3x text-muted mb-3"></i>
                            <h4>No jobs posted yet</h4>
                            <p>Start posting jobs to manage them here.</p>
                        </div>
                    ) : (
                        <div className="twm-D_table p-a20 table-responsive">
                            <table
                                id="jobs_bookmark_table"
                                className="table table-bordered twm-bookmark-list-wrap"
                            >
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Category</th>
                                        <th>Job Type</th>
                                        <th>Work Mode</th>
                                        <th>Created &amp; Expired</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => {
                                        const workModeStyle =
                                            getWorkModeBadge(job.work_mode);

                                        return (
                                            <tr key={job.id}>
                                                <td>
                                                    <div className="twm-bookmark-list">
                                                        <div className="twm-media">
                                                            <div className="twm-media-pic">
                                                                {job.company_name ? (
                                                                    <div className="twm-jobs-browse-pic">
                                                                        <span>
                                                                            {job.company_name.charAt(
                                                                                0
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <JobZImage
                                                                        src="images/jobs-company/pic1.jpg"
                                                                        alt="#"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="twm-mid-content">
                                                            <a
                                                                href="#"
                                                                className="twm-job-title"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleView(
                                                                        job.slug
                                                                    );
                                                                }}
                                                            >
                                                                <h4>
                                                                    {job.title}
                                                                </h4>
                                                                <p className="twm-bookmark-address">
                                                                    <i className="feather-map-pin" />{" "}
                                                                    {job.city},{" "}
                                                                    {job.country}
                                                                    {job.location &&
                                                                        ` - ${job.location}`}
                                                                </p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{job.category_name || "N/A"}</td>
                                                <td>
                                                    <div className="twm-jobs-category">
                                                        <span
                                                            className={getJobTypeBadge(
                                                                job.job_type_name
                                                            )}
                                                        >
                                                            {job.job_type_name ||
                                                                "N/A"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                workModeStyle.bg,
                                                            color: workModeStyle.text,
                                                            padding: "5px 12px",
                                                            borderRadius: "4px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            display:
                                                                "inline-block",
                                                            minWidth: "70px",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {job.work_mode || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div>
                                                        <small>Created:</small>{" "}
                                                        {formatDate(
                                                            job.created_at
                                                        )}
                                                    </div>
                                                    <div>
                                                        <small>Expires:</small>{" "}
                                                        {formatDate(job.end_date)}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="twm-table-controls">
                                                        <ul className="twm-DT-controls-icon list-unstyled">
                                                            <li>
                                                                <button
                                                                    title="View job"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-placement="top"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            job.slug
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="fa fa-eye" />
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    title="Edit"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-placement="top"
                                                                    onClick={() =>
                                                                        handleOpenEditForm(
                                                                            job
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="far fa-edit" />
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    title="Delete"
                                                                    data-bs-toggle="tooltip"
                                                                    data-bs-placement="top"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            job.id,
                                                                            job.title
                                                                        )
                                                                    }
                                                                    className="text-danger"
                                                                >
                                                                    <span className="far fa-trash-alt" />
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Category</th>
                                        <th>Job Type</th>
                                        <th>Work Mode</th>
                                        <th>Created &amp; Expired</th>
                                        <th>Action</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default EmpManageJobsPage;
