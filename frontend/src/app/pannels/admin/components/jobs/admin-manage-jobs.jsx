import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";

const API_URL = "http://127.0.0.1:8000/api";

function AdminManageJobsPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
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

    // Edit Mode
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);

    // Fetch jobs and dropdown data when token is available
    useEffect(() => {
        if (token) {
            fetchJobs();
            fetchCategories();
            fetchJobTypes();
        }
    }, [token]);

    // Update filtered jobs when search term or jobs change
    useEffect(() => {
        filterJobs();
    }, [searchTerm, jobs]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/jobs/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(response.data);
            setError(null);
        } catch (err) {
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories/`);
            setCategories(response.data);
        } catch {}
    };

    const fetchJobTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/job-type/`);
            setJobTypes(response.data);
        } catch {}
    };

    // Filter jobs based on search term
    const filterJobs = () => {
        if (!searchTerm.trim()) {
            setFilteredJobs(jobs);
            setCurrentPage(1);
        } else {
            const filtered = jobs.filter((job) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    job.title.toLowerCase().includes(searchLower) ||
                    job.city.toLowerCase().includes(searchLower) ||
                    job.country.toLowerCase().includes(searchLower) ||
                    (job.category_name &&
                        job.category_name.toLowerCase().includes(searchLower)) ||
                    (job.job_type_name &&
                        job.job_type_name.toLowerCase().includes(searchLower))
                );
            });
            setFilteredJobs(filtered);
            setCurrentPage(1);
        }
    };

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredJobs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredJobs.length / recordsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Edit handler
    const handleEdit = (job) => {
        setFormData({
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
        setEditMode(true);
        setEditId(job.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // View button handler
    const handleView = (slug) => {
        // Change below to your job details route if needed:
        navigate(`/job-detail/${slug}`);
    };

    // Save
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const cleanedData = {
                ...formData,
                salary_range: formData.salary_range || null,
                requirements: formData.requirements || null,
                responsibilities: formData.responsibilities || null,
                skills_required: formData.skills_required || null,
                experience: formData.experience || null,
                qualification: formData.qualification || null,
                location: formData.location || null,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
                website: formData.website || null,
                est_since: formData.est_since || null,
                complete_address: formData.complete_address || null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                category: formData.category ? parseInt(formData.category) : null,
                job_type: formData.job_type ? parseInt(formData.job_type) : null,
            };

            await axios.put(`${API_URL}/jobs/${editId}/`, cleanedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ SUCCESS: Job updated successfully!");
            resetFormState();
            fetchJobs();
        } catch (error) {
            const errorMsg =
                error.response?.data?.title?.[0] ||
                error.response?.data?.detail ||
                "Failed to update job";
            alert(`❌ ERROR: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    // Delete
    const handleDelete = async (jobId, jobTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`))
            return;
        try {
            await axios.delete(`${API_URL}/jobs/${jobId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Job deleted successfully!");
            fetchJobs();
        } catch (err) {
            const errorMsg = err.response?.data?.detail || "Failed to delete job";
            alert(`❌ ERROR: ${errorMsg}`);
        }
    };

    const resetFormState = () => {
        setFormData({
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
        setEditMode(false);
        setEditId(null);
        setShowForm(false);
    };

    const handleCancelForm = () => resetFormState();

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

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
                <p>Loading jobs...</p>
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
                    <span>Job Listing</span>
                </div>
            </div>

            {/* EDIT FORM PANEL */}
            {showForm && (
                <div className="panel panel-default m-b30">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0">
                            <i className="fa fa-edit" />{" "}
                            {editMode ? "Edit Job" : "Job Form"}
                        </h4>
                    </div>
                    <div className="panel-body wt-panel-body p-a20">
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="row">
                                {/* Job Title */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Job Title</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="title"
                                                className="form-control"
                                                type="text"
                                                placeholder="Job Title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <i className="fs-input-icon fa fa-address-card" />
                                        </div>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Job Category</label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="category"
                                                className="form-control"
                                                value={formData.category || ""}
                                                onChange={handleInputChange}
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
                                                value={formData.job_type || ""}
                                                onChange={handleInputChange}
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
                                                value={formData.work_mode}
                                                onChange={handleInputChange}
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
                                                value={formData.salary_range}
                                                onChange={handleInputChange}
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
                                                value={formData.experience}
                                                onChange={handleInputChange}
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
                                                value={formData.qualification}
                                                onChange={handleInputChange}
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
                                                value={formData.gender}
                                                onChange={handleInputChange}
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
                                                value={formData.country}
                                                onChange={handleInputChange}
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
                                                value={formData.city}
                                                onChange={handleInputChange}
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
                                                value={formData.location}
                                                onChange={handleInputChange}
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
                                                value={formData.latitude}
                                                onChange={handleInputChange}
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
                                                value={formData.longitude}
                                                onChange={handleInputChange}
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
                                                value={formData.email}
                                                onChange={handleInputChange}
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
                                                value={formData.website}
                                                onChange={handleInputChange}
                                            />
                                            <i className="fs-input-icon fa fa-globe-americas" />
                                        </div>
                                    </div>
                                </div>

                                {/* Est Since */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Est. Since</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="est_since"
                                                className="form-control"
                                                type="text"
                                                placeholder="Since..."
                                                value={formData.est_since}
                                                onChange={handleInputChange}
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
                                                value={formData.complete_address}
                                                onChange={handleInputChange}
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
                                            value={formData.description}
                                            onChange={handleInputChange}
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
                                            value={formData.requirements}
                                            onChange={handleInputChange}
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
                                            value={formData.responsibilities}
                                            onChange={handleInputChange}
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
                                            value={formData.skills_required}
                                            onChange={handleInputChange}
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
                                                value={formData.start_date || ""}
                                                onChange={handleInputChange}
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
                                                value={formData.end_date || ""}
                                                onChange={handleInputChange}
                                            />
                                            <i className="fs-input-icon far fa-calendar" />
                                        </div>
                                    </div>
                                </div>


                            </div>
                                {/* Buttons */}
                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button
                                        type="submit"
                                        className="site-button m-r5"
                                        disabled={saving}
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        className="site-button outline-primary"
                                        onClick={handleCancelForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* JOBS TABLE */}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20 d-flex justify-content-between align-items-center">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-suitcase" /> Job List
                    </h4>
                    <div className="form-inline">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ minWidth: "260px" }}
                        />
                    </div>
                </div>

                <div className="panel-body wt-panel-body p-a20 m-b30">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {filteredJobs.length === 0 ? (
                        <div className="text-center p-5">
                            <i className="fa fa-briefcase fa-3x text-muted mb-3"></i>
                            <h4>No jobs found</h4>
                        </div>
                    ) : (
                        <>
                            <div className="twm-D_table p-a20 table-responsive">
                                <table className="table table-bordered twm-bookmark-list-wrap">
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
                                        {currentRecords.map((job) => {
                                            const wm = getWorkModeBadge(
                                                job.work_mode
                                            );
                                            return (
                                                <tr key={job.id}>
                                                    <td>
                                                        <div className="twm-bookmark-list">
                                                            <div className="twm-media">
                                                                <div className="twm-media-pic">
                                                                    <JobZImage
                                                                        src="images/jobs-company/pic1.jpg"
                                                                        alt="#"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="twm-mid-content">
                                                                <h4>{job.title}</h4>
                                                                <p className="twm-bookmark-address">
                                                                    <i className="feather-map-pin" />{" "}
                                                                    {job.city},{" "}
                                                                    {job.country}
                                                                </p>
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
                                                                    wm.bg,
                                                                color: wm.text,
                                                                padding:
                                                                    "5px 12px",
                                                                borderRadius:
                                                                    "4px",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "500",
                                                                display:
                                                                    "inline-block",
                                                                minWidth:
                                                                    "70px",
                                                                textAlign:
                                                                    "center",
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
                                                            {formatDate(
                                                                job.end_date
                                                            )}
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
                                                                            handleEdit(
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
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="d-flex justify-content-between align-items-center p-a20">
                                <span>
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <div>
                                    <button
                                        className="btn btn-sm btn-outline-secondary m-r5"
                                        disabled={currentPage === 1}
                                        onClick={goToPreviousPage}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        disabled={
                                            currentPage === totalPages ||
                                            totalPages === 0
                                        }
                                        onClick={goToNextPage}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                            {/* Page numbers */}
                            {totalPages > 1 && (
                                <nav className="d-flex justify-content-center mb-3">
                                    <ul className="pagination">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map((number) => (
                                            <li
                                                key={number}
                                                className={`page-item ${
                                                    number === currentPage
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        paginate(number)
                                                    }
                                                >
                                                    {number}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminManageJobsPage;