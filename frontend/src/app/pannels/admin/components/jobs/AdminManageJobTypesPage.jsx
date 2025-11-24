import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function AdminManageJobTypesPage() {
    const [jobTypes, setJobTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: ''
    });
    
    // Edit Mode
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    
    // Loading States
    const [saving, setSaving] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    
    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredJobTypes, setFilteredJobTypes] = useState([]);

    useEffect(() => {
        fetchJobTypes();
    }, []);

    // Update filtered job types when search term or job types change
    useEffect(() => {
        filterJobTypes();
    }, [searchTerm, jobTypes]);

    const fetchJobTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/job-type/`);
            console.log('Fetched job types:', response.data); // Debug log
            setJobTypes(response.data);
        } catch (error) {
            console.error('Error fetching job types:', error);
            console.error('Error response:', error.response); // Debug log
            alert('❌ ERROR: Failed to load job types. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    // Filter job types based on search term
    const filterJobTypes = () => {
        if (!searchTerm.trim()) {
            setFilteredJobTypes(jobTypes);
            setCurrentPage(1);
        } else {
            const filtered = jobTypes.filter((jobType) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    jobType.name.toLowerCase().includes(searchLower) ||
                    (jobType.slug && jobType.slug.toLowerCase().includes(searchLower))
                );
            });
            setFilteredJobTypes(filtered);
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
    const currentRecords = filteredJobTypes.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredJobTypes.length / recordsPerPage);

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

    // Handle form submission (Add/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('⚠️ WARNING: Job type name is required');
            return;
        }

        setSaving(true);

        try {
            console.log('Submitting data:', formData); // Debug log
            
            if (editMode) {
                console.log('Updating job type with ID:', editId); // Debug log
                const response = await axios.put(
                    `${API_URL}/job-type/${editId}/`,
                    formData
                );
                console.log('Update response:', response.data); // Debug log
                alert('✅ SUCCESS: Job type updated successfully!');
            } else {
                console.log('Creating new job type'); // Debug log
                const response = await axios.post(
                    `${API_URL}/job-type/`,
                    formData
                );
                console.log('Create response:', response.data); // Debug log
                alert('✅ SUCCESS: Job type added successfully!');
            }
            
            setFormData({ name: '' });
            setEditMode(false);
            setEditId(null);
            setShowForm(false);
            fetchJobTypes();
        } catch (error) {
            console.error('Error saving job type:', error); // Debug log
            console.error('Error response:', error.response); // Debug log
            
            const errorMsg = error.response?.data?.name?.[0] || 
                            error.response?.data?.detail || 
                            error.response?.data?.message ||
                            'Failed to save job type';
            alert(`❌ ERROR: ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    // Handle edit
    const handleEdit = (jobType) => {
        console.log('Editing job type:', jobType); // Debug log
        setFormData({
            name: jobType.name
        });
        setEditMode(true);
        setEditId(jobType.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle delete
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}" job type?`)) {
            return;
        }

        try {
            console.log('Deleting job type with ID:', id); // Debug log
            await axios.delete(`${API_URL}/job-type/${id}/`);
            alert('✅ Job type deleted successfully!');
            fetchJobTypes();
        } catch (error) {
            console.error('Error deleting job type:', error); // Debug log
            console.error('Error response:', error.response); // Debug log
            
            const errorMsg = error.response?.data?.detail || 'Failed to delete job type';
            alert(`❌ ${errorMsg}`);
        }
    };

    // Cancel form
    const handleCancelForm = () => {
        setFormData({ name: '' });
        setEditMode(false);
        setEditId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div>
                <div className="wt-admin-right-page-header clearfix">
                    <h2>Job Types</h2>
                    <div className="breadcrumbs">
                        <a href="#">Home</a>
                        <a href="#">Dashboard</a>
                        <span>Job Types</span>
                    </div>
                </div>

                {/* Add Job Type Button */}
                {!showForm && (
                    <div className="mb-4">
                        <button 
                            className="site-button"
                            onClick={() => setShowForm(true)}
                        >
                            <i className="fa fa-plus"></i> Add New Job Type
                        </button>
                    </div>
                )}

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white">
                            <div className="panel-heading wt-panel-heading p-a20">
                                <h4 className="panel-tittle m-a0">
                                    <i className="fa fa-edit" />
                                    {editMode ? ' Edit Job Type' : ' Add New Job Type'}
                                </h4>
                            </div>
                            <div className="panel-body wt-panel-body p-a20">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <label>Job Type Name <span className="text-danger">*</span></label>
                                                <input
                                                    className="form-control"
                                                    name="name"
                                                    type="text"
                                                    placeholder="e.g., Full-time, Part-time, Contract"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="text-left">
                                                <button
                                                    type="submit"
                                                    className="site-button m-r5"
                                                    disabled={saving}
                                                >
                                                    {saving ? 'Saving...' : editMode ? 'Update Job Type' : 'Add Job Type'}
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
                    </div>
                )}

                {/* Job Types Table */}
                <div className="twm-pro-view-chart-wrap">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white m-t30">
                            <div className="panel-heading wt-panel-heading p-a20">
                                <h4 className="panel-tittle m-a0">
                                    <i className="fa fa-list" /> All Job Types ({filteredJobTypes.length})
                                </h4>
                            </div>
                            <div className="panel-body wt-panel-body">
                                {/* Search Box */}
                                <div className="p-a20 pb-3">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by name or slug..."
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

                                <div className="twm-D_table p-a20 table-responsive">
                                    <table id="jobtype_table" className="table table-bordered twm-bookmark-list-wrap">
                                        <thead>
                                            <tr>
                                                <th>Sl No.</th>
                                                <th>Job Type Name</th>
                                                <th>Slug</th>
                                                <th>Jobs Count</th>
                                                <th>Created Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center">
                                                        <div className="p-4">
                                                            <i className="fa fa-info-circle fa-2x text-muted mb-2"></i>
                                                            <p>
                                                                {searchTerm 
                                                                    ? `No job types found matching "${searchTerm}"` 
                                                                    : 'No job types found. Add your first job type!'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentRecords.map((jobType, index) => {
                                                    const serialNumber = indexOfFirstRecord + index + 1;
                                                    
                                                    return (
                                                        <tr key={jobType.id}>
                                                            <td>
                                                                <div className="twm-bookmark-list">
                                                                    <span className="badge bg-secondary">{serialNumber}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="twm-bookmark-list">
                                                                    <div className="twm-mid-content">
                                                                        <h4 className="twm-job-title">
                                                                            <strong>{jobType.name}</strong>
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <code>{jobType.slug || 'N/A'}</code>
                                                            </td>
                                                            <td>
                                                                <div className="text-center">
                                                                    <span className="badge bg-primary" style={{ fontSize: '14px' }}>
                                                                        {jobType.job_count || 0}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="twm-job-post-duration">
                                                                    {jobType.created_at ? new Date(jobType.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    }) : 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="twm-table-controls">
                                                                    <ul className="twm-DT-controls-icon list-unstyled">
                                                                        <li>
                                                                            <button 
                                                                                title="Edit" 
                                                                                data-bs-toggle="tooltip" 
                                                                                data-bs-placement="top"
                                                                                onClick={() => handleEdit(jobType)}
                                                                            >
                                                                                <span className="fa fa-edit" />
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button 
                                                                                title="Delete" 
                                                                                data-bs-toggle="tooltip" 
                                                                                data-bs-placement="top"
                                                                                onClick={() => handleDelete(jobType.id, jobType.name)}
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
                                                <th>Job Type Name</th>
                                                <th>Slug</th>
                                                <th>Jobs Count</th>
                                                <th>Created Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredJobTypes.length > 0 && (
                                    <div className="p-a20" style={{ borderTop: '1px solid #dee2e6' }}>
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
                                                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredJobTypes.length)} of {filteredJobTypes.length} entries
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminManageJobTypesPage;