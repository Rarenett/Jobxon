import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import JobZImage from "../../../../common/jobz-img";

const API_URL = "http://127.0.0.1:8000/api";

function AdminManageJobsPage() {
    const { token } = useAuth();
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
        offered_salary: "",
        experience: "",
        qualification: "",
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
    const [searchTerm, setSearchTerm] = useState('');
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
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories/`);
            setCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const fetchJobTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/job-type/`);
            setJobTypes(response.data);
        } catch (err) {
            console.error("Error fetching job types:", err);
        }
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
                    (job.category_name && job.category_name.toLowerCase().includes(searchLower)) ||
                    (job.job_type_name && job.job_type_name.toLowerCase().includes(searchLower))
                );
            });
            setFilteredJobs(filtered);
            setCurrentPage(1);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredJobs.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredJobs.length / recordsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Next and Previous page handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission (Update only, not create)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('⚠️ WARNING: Job title is required');
            return;
        }

        setSaving(true);

        try {
            const cleanedData = {
                ...formData,
                offered_salary: formData.offered_salary || null,
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

            await axios.put(
                `${API_URL}/jobs/${editId}/`,
                cleanedData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('✅ SUCCESS: Job updated successfully!');

            setFormData({
                title: "",
                category: "",
                job_type: "",
                offered_salary: "",
                experience: "",
                qualification: "",
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
            fetchJobs();
        } catch (error) {
            const errorMsg = error.response?.data?.title?.[0] ||
                error.response?.data?.detail ||
                'Failed to update job';
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // Handle edit
    const handleEdit = (job) => {
        setFormData({
            title: job.title,
            category: job.category || "",
            job_type: job.job_type || "",
            offered_salary: job.offered_salary || "",
            experience: job.experience || "",
            qualification: job.qualification || "",
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle delete
    const handleDelete = async (jobId, jobTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;

        try {
            await axios.delete(`${API_URL}/jobs/${jobId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Job deleted successfully!");
            fetchJobs();
        } catch (err) {
            console.error("Error deleting job:", err);
            const errorMsg = err.response?.data?.detail || "Failed to delete job";
            alert(`❌ ERROR: ${errorMsg}`);
        }
    };

    // Cancel form
    const handleCancelForm = () => {
        setFormData({
            title: "",
            category: "",
            job_type: "",
            offered_salary: "",
            experience: "",
            qualification: "",
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!token) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2>Checking authentication...</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wt-admin-right-page-header clearfix">
                <h2 style={{ color: 'red' }}>{error}</h2>
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

            {/* Edit Form */}
            {showForm && editMode && (
                <div className="panel panel-default mb-4">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0">
                            <i className="fa fa-edit" /> Edit Job
                        </h4>
                    </div>
                    <div className="panel-body wt-panel-body p-a20">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Job title */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Job Title <span className="text-danger">*</span></label>
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

                                {/* Job Category */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group city-outer-bx has-feedback">
                                        <label>Job Category <span className="text-danger">*</span></label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="category"
                                                className="form-control"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <i className="fs-input-icon fa fa-border-all" />
                                        </div>
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Job Type <span className="text-danger">*</span></label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="job_type"
                                                className="form-control"
                                                value={formData.job_type}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                {jobTypes.map(jt => (
                                                    <option key={jt.id} value={jt.id}>{jt.name}</option>
                                                ))}
                                            </select>
                                            <i className="fs-input-icon fa fa-file-alt" />
                                        </div>
                                    </div>
                                </div>

                                {/* Offered Salary */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Offered Salary</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="offered_salary"
                                                className="form-control"
                                                type="text"
                                                placeholder="e.g. $3000"
                                                value={formData.offered_salary}
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
                                        <label>Gender <span className="text-danger">*</span></label>
                                        <div className="ls-inputicon-box">
                                            <select
                                                name="gender"
                                                className="form-control"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                                <option value="Any">Any</option>
                                            </select>
                                            <i className="fs-input-icon fa fa-venus-mars" />
                                        </div>
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Country <span className="text-danger">*</span></label>
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
                                        <label>City <span className="text-danger">*</span></label>
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

                                {/* Email Address */}
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                    <div className="form-group">
                                        <label>Email Address <span className="text-danger">*</span></label>
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
                                        <label>Description <span className="text-danger">*</span></label>
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

                                {/* Start Date */}
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <div className="ls-inputicon-box">
                                            <input
                                                name="start_date"
                                                className="form-control"
                                                type="date"
                                                value={formData.start_date}
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
                                                value={formData.end_date}
                                                onChange={handleInputChange}
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
                                            disabled={saving}
                                        >
                                            {saving ? 'Updating...' : 'Update Job'}
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
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Jobs Table */}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">
                        <i className="fa fa-suitcase" /> All Jobs ({filteredJobs.length})
                    </h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30">
                    {/* Search Box */}
                    <div className="pb-3">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by title, location, category, or job type..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        <span className="input-group-text">
                                            <i className="fa fa-search"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="twm-D_table table-responsive">
                        <table id="jobs_bookmark_table" className="table table-bordered twm-bookmark-list-wrap">
                            <thead>
                                <tr>
                                    <th>Sl No.</th>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Job Type</th>
                                    <th>Location</th>
                                    <th>Created & Expired</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <div className="p-4">
                                                <i className="fa fa-info-circle fa-2x text-muted mb-2"></i>
                                                <p>
                                                    {searchTerm
                                                        ? `No jobs found matching "${searchTerm}"`
                                                        : 'No jobs found. Post your first job!'}
                                                </p>
                                                {!searchTerm && (
                                                    <a href="/admin/post-a-job" className="site-button">
                                                        <i className="fa fa-plus"></i> Post a Job
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    currentRecords.map((job, index) => {
                                        const serialNumber = indexOfFirstRecord + index + 1;
                                        return (
                                            <tr key={job.id}>
                                                <td>
                                                    <span className="badge bg-secondary">{serialNumber}</span>
                                                </td>
                                                <td>
                                                    <div className="twm-bookmark-list">
                                                        <div className="twm-media">
                                                            <div className="twm-media-pic">
                                                                <JobZImage
                                                                    src="images/jobs-company/pic1.jpg"
                                                                    alt={job.title}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="twm-mid-content">
                                                            <a href="#" className="twm-job-title">
                                                                <h4>{job.title}</h4>
                                                                <p className="twm-bookmark-address">
                                                                    <i className="feather-map-pin" />
                                                                    {job.city}, {job.country}
                                                                </p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {job.category_name || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="twm-jobs-category">
                                                        <span className="twm-bg-purple">
                                                            {job.job_type_name || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    {job.city}, {job.country}
                                                </td>
                                                <td>
                                                    <div>{formatDate(job.created_at)}</div>
                                                    <div className="text-muted">{formatDate(job.end_date)}</div>
                                                </td>
                                                <td>
                                                    <div className="twm-table-controls">
                                                        <ul className="twm-DT-controls-icon list-unstyled">
                                                            <li>
                                                                <button
                                                                    title="View"
                                                                    data-bs-toggle="tooltip"
                                                                    onClick={() => window.open(`/jobs/${job.slug}`, '_blank')}
                                                                >
                                                                    <span className="fa fa-eye" />
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    title="Edit"
                                                                    data-bs-toggle="tooltip"
                                                                    onClick={() => handleEdit(job)}
                                                                >
                                                                    <span className="far fa-edit" />
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    title="Delete"
                                                                    data-bs-toggle="tooltip"
                                                                    onClick={() => handleDelete(job.id, job.title)}
                                                                >
                                                                    <span className="far fa-trash-alt" />
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th>Sl No.</th>
                                    <th>Job Title</th>
                                    <th>Category</th>
                                    <th>Job Type</th>
                                    <th>Location</th>
                                    <th>Created & Expired</th>
                                    <th>Action</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredJobs.length > 0 && (
                        <div className="p-a20" style={{ borderTop: '1px solid #dee2e6' }}>
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
                                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredJobs.length)} of {filteredJobs.length} entries
                                    </p>
                                </div>

                                <div className="col-md-6">
                                    <nav aria-label="Page navigation" className="d-flex justify-content-end">
                                        <ul className="pagination mb-0" style={{ gap: '5px' }}>
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={goToPreviousPage}
                                                    disabled={currentPage === 1}
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '4px',
                                                        backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff',
                                                        color: currentPage === 1 ? '#6c757d' : '#007bff',
                                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    Previous
                                                </button>
                                            </li>

                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                return (
                                                    <li
                                                        key={pageNumber}
                                                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                                    >
                                                        <button
                                                            className="page-link"
                                                            onClick={() => paginate(pageNumber)}
                                                            style={{
                                                                padding: '8px 16px',
                                                                border: '1px solid #dee2e6',
                                                                borderRadius: '4px',
                                                                backgroundColor: currentPage === pageNumber ? '#007bff' : '#fff',
                                                                color: currentPage === pageNumber ? '#fff' : '#007bff',
                                                                fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
                                                                cursor: 'pointer',
                                                                minWidth: '45px'
                                                            }}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    </li>
                                                );
                                            })}

                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={goToNextPage}
                                                    disabled={currentPage === totalPages}
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '4px',
                                                        backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#fff',
                                                        color: currentPage === totalPages ? '#6c757d' : '#007bff',
                                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminManageJobsPage;
