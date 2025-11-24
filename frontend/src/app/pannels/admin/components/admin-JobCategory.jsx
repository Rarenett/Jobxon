import { useEffect, useState } from "react";
import { loadScript } from "../../../../globals/constants";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

const API_URL = "http://localhost:8000/api";

function AdminJobCategory() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        icon: ''
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
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
        loadScript("js/custom.js");
        fetchCategories();
    }, []);

    // Update filtered categories when search term or categories change
    useEffect(() => {
        filterCategories();
    }, [searchTerm, categories]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/categories/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('❌ ERROR: Failed to load categories. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    // Filter categories based on search term
    const filterCategories = () => {
        if (!searchTerm.trim()) {
            setFilteredCategories(categories);
            setCurrentPage(1);
        } else {
            const filtered = categories.filter((category) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    category.name.toLowerCase().includes(searchLower) ||
                    category.slug.toLowerCase().includes(searchLower) ||
                    (category.icon && category.icon.toLowerCase().includes(searchLower))
                );
            });
            setFilteredCategories(filtered);
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
    const currentRecords = filteredCategories.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);

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
            alert('⚠️ WARNING: Category name is required');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('access_token');
            
            if (editMode) {
                await axios.put(
                    `${API_URL}/categories/${editId}/`,
                    formData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                alert('✅ SUCCESS: Category updated successfully!');
            } else {
                await axios.post(
                    `${API_URL}/categories/`,
                    formData,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                alert('✅ SUCCESS: Category added successfully!');
            }
            
            setFormData({ name: '', icon: '' });
            setEditMode(false);
            setEditId(null);
            setShowForm(false);
            fetchCategories();
        } catch (error) {
            const errorMsg = error.response?.data?.name?.[0] || 
                            error.response?.data?.detail || 
                            'Failed to save category';
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // Handle edit
    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            icon: category.icon || ''
        });
        setEditMode(true);
        setEditId(category.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle delete
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}" category?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`${API_URL}/categories/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('✅ Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to delete category';
            alert(`❌ ${errorMsg}`);
            console.error(error);
        }
    };

    // Cancel form
    const handleCancelForm = () => {
        setFormData({ name: '', icon: '' });
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
                    <h2>Job Categories</h2>
                    <div className="breadcrumbs">
                        <a href="#">Home</a>
                        <a href="#">Dashboard</a>
                        <span>Job Categories</span>
                    </div>
                </div>

                {/* Add Category Button */}
                {!showForm && (
                    <div className="mb-4">
                        <button 
                            className="site-button"
                            onClick={() => setShowForm(true)}
                        >
                            <i className="fa fa-plus"></i> Add New Category
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
                                    {editMode ? 'Edit Category' : 'Add New Category'}
                                </h4>
                            </div>
                            <div className="panel-body wt-panel-body p-a20">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-xl-6 col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <label>Category Name <span className="text-danger">*</span></label>
                                                <input
                                                    className="form-control"
                                                    name="name"
                                                    type="text"
                                                    placeholder="e.g., Software Development"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-xl-6 col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <label>Icon Class (FontAwesome)</label>
                                                <input
                                                    className="form-control"
                                                    name="icon"
                                                    type="text"
                                                    placeholder="e.g., fa-solid fa-laptop"
                                                    value={formData.icon}
                                                    onChange={handleInputChange}
                                                />
                                                <small className="text-muted">
                                                    Example: fa-solid fa-code, fa-solid fa-briefcase
                                                </small>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="text-left">
                                                <button
                                                    type="submit"
                                                    className="site-button m-r5"
                                                    disabled={saving}
                                                >
                                                    {saving ? 'Saving...' : editMode ? 'Update Category' : 'Add Category'}
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

                {/* Categories Table */}
                <div className="twm-pro-view-chart-wrap">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white m-t30">
                            <div className="panel-heading wt-panel-heading p-a20">
                                <h4 className="panel-tittle m-a0">
                                    <i className="fa fa-list" /> All Categories ({filteredCategories.length})
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
                                                        placeholder="Search by name, slug, or icon..."
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
                                    <table id="category_table" className="table table-bordered twm-bookmark-list-wrap">
                                        <thead>
                                            <tr>
                                                <th>Sl No.</th>
                                                <th>Icon</th>
                                                <th>Category Name</th>
                                                <th>Slug</th>
                                                <th>Jobs Count</th>
                                                <th>Created Date</th>
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
                                                                    ? `No categories found matching "${searchTerm}"` 
                                                                    : 'No categories found. Add your first category!'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentRecords.map((category, index) => {
                                                    // Calculate serial number based on current page
                                                    const serialNumber = indexOfFirstRecord + index + 1;
                                                    
                                                    return (
                                                        <tr key={category.id}>
                                                            <td>
                                                                <div className="twm-bookmark-list">
                                                                    <span className="badge bg-secondary">{serialNumber}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="text-center">
                                                                    {category.icon ? (
                                                                        <i 
                                                                            className={category.icon} 
                                                                            style={{ fontSize: '28px' }}
                                                                            title={category.icon}
                                                                        ></i>
                                                                    ) : (
                                                                        <i 
                                                                            className="fa fa-briefcase text-muted" 
                                                                            style={{ fontSize: '28px' }}
                                                                        ></i>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="twm-bookmark-list">
                                                                    <div className="twm-mid-content">
                                                                        <h4 className="twm-job-title">
                                                                            <strong>{category.name}</strong>
                                                                        </h4>
                                                                        {category.icon && (
                                                                            <p className="twm-bookmark-address text-muted">
                                                                                <small>
                                                                                    <code>{category.icon}</code>
                                                                                </small>
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <code>{category.slug}</code>
                                                            </td>
                                                            <td>
                                                                <div className="text-center">
                                                                    <span className="badge bg-primary" style={{ fontSize: '14px' }}>
                                                                        {category.job_count || 0}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="twm-job-post-duration">
                                                                    {new Date(category.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
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
                                                                                onClick={() => handleEdit(category)}
                                                                            >
                                                                                <span className="fa fa-edit" />
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button 
                                                                                title="Delete" 
                                                                                data-bs-toggle="tooltip" 
                                                                                data-bs-placement="top"
                                                                                onClick={() => handleDelete(category.id, category.name)}
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
                                                <th>Icon</th>
                                                <th>Category Name</th>
                                                <th>Slug</th>
                                                <th>Jobs Count</th>
                                                <th>Created Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Pagination - Matching Image Style */}
                                {filteredCategories.length > 0 && (
                                    <div className="p-a20" style={{ borderTop: '1px solid #dee2e6' }}>
                                        <div className="row align-items-center">
                                            {/* Left side - Showing entries text */}
                                            <div className="col-md-6">
                                                <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
                                                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredCategories.length)} of {filteredCategories.length} entries
                                                </p>
                                            </div>
                                            
                                            {/* Right side - Pagination buttons */}
                                            <div className="col-md-6">
                                                <nav aria-label="Page navigation" className="d-flex justify-content-end">
                                                    <ul className="pagination mb-0" style={{ gap: '5px' }}>
                                                        {/* Previous Button */}
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

                                                        {/* Page Numbers */}
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

                                                        {/* Next Button */}
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

export default AdminJobCategory;
