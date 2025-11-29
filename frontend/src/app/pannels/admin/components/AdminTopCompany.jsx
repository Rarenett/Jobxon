import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

// CHANGE THIS LINE - Remove /api
const API_URL = "http://localhost:8000";

function AdminTopCompany() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        logo: null,
        website_url: '',
        is_featured: true,
        display_order: 0
    });

    // Image preview
    const [logoPreview, setLogoPreview] = useState(null);

    // Edit mode
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    // Loading (saving)
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        filterCompanies();
    }, [searchTerm, companies]);

    // Fetch companies
    const fetchCompanies = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            // Now calls: http://localhost:8000/top-companies/
            const response = await axios.get(`${API_URL}/top-companies/`, { headers });
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            alert('❌ ERROR: Failed to load companies.');
        } finally {
            setLoading(false);
        }
    };

    // Search & filter
    const filterCompanies = () => {
        if (!searchTerm.trim()) {
            setFilteredCompanies(companies);
            setCurrentPage(1);
        } else {
            const searchLower = searchTerm.toLowerCase();
            const filtered = companies.filter(company =>
                company.name.toLowerCase().includes(searchLower) ||
                (company.website_url && company.website_url.toLowerCase().includes(searchLower))
            );
            setFilteredCompanies(filtered);
            setCurrentPage(1);
        }
    };

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredCompanies.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);

    // Pagination handlers
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); }
    const goToPreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); }

    // Form input handlers
    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Handle logo file selection
    const handleLogoChange = e => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add/Edit Submit
    const handleSubmit = async e => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('⚠️ Company name is required');
            return;
        }

        if (!editMode && !formData.logo) {
            alert('⚠️ Please upload a company logo');
            return;
        }

        setSaving(true);
        const token = localStorage.getItem('access_token');
        
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('website_url', formData.website_url);
        submitData.append('is_featured', formData.is_featured);
        submitData.append('display_order', formData.display_order);
        
        if (formData.logo instanceof File) {
            submitData.append('logo', formData.logo);
        }

        try {
            if (editMode) {
                await axios.put(`${API_URL}/top-companies/${editId}/`, submitData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('✅ Company updated!');
            } else {
                await axios.post(`${API_URL}/top-companies/`, submitData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('✅ Company added!');
            }
            resetForm();
            fetchCompanies();
        } catch (error) {
            console.error('Error saving company:', error);
            console.error('Error response:', error.response?.data);
            alert(`❌ Error saving company: ${error.response?.data?.detail || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    // Edit handler
    const handleEdit = (company) => {
        console.log("Edit clicked", company);
        setFormData({
            name: company.name,
            logo: null,
            website_url: company.website_url || '',
            is_featured: !!company.is_featured,
            display_order: company.display_order || 0
        });
        
        if (company.logo) {
            const logoUrl = company.logo.startsWith('http') 
                ? company.logo 
                : `http://localhost:8000${company.logo}`;
            setLogoPreview(logoUrl);
        }
        
        setEditMode(true);
        setEditId(company.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete handler
    const handleDelete = async (id, name) => {
        console.log("Delete clicked", id);
        if (!window.confirm(`Delete ${name}?`)) return;
        
        const token = localStorage.getItem("access_token");
        try {
            await axios.delete(`${API_URL}/top-companies/${id}/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            alert('✅ Company deleted!');
            fetchCompanies();
        } catch (error) {
            console.error('Error deleting company:', error);
            alert('❌ Error deleting company.');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            logo: null,
            website_url: '',
            is_featured: true,
            display_order: 0
        });
        setLogoPreview(null);
        setEditMode(false);
        setEditId(null);
        setShowForm(false);
    };

    // Cancel form
    const handleCancelForm = () => {
        resetForm();
    };

    // Show loading spinner
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
        <div>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Top Companies</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Top Companies</span>
                </div>
            </div>

            {/* Add Company Button */}
            {!showForm && (
                <div className="mb-4">
                    <button className="site-button" onClick={() => setShowForm(true)}>
                        <i className="fa fa-plus"></i> Add New Company
                    </button>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="col-lg-12 col-md-12 mb-4">
                    <div className="panel panel-default site-bg-white">
                        <div className="panel-heading wt-panel-heading p-a20">
                            <h4 className="panel-tittle m-a0">
                                <i className="fa fa-edit" /> {editMode ? 'Edit Company' : 'Add New Company'}
                            </h4>
                        </div>
                        <div className="panel-body wt-panel-body p-a20">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label>Company Name <span className="text-danger">*</span></label>
                                            <input
                                                className="form-control"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Google, Microsoft, Apple"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label>Website URL</label>
                                            <input
                                                className="form-control"
                                                name="website_url"
                                                type="url"
                                                value={formData.website_url}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-xl-6 col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <label>Company Logo {!editMode && <span className="text-danger">*</span>}</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                required={!editMode}
                                            />
                                            <small className="text-muted">Recommended: Square image (200x200px or larger)</small>
                                        </div>
                                        
                                        {logoPreview && (
                                            <div className="mt-3">
                                                <label className="d-block mb-2">Logo Preview:</label>
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo preview"
                                                    style={{
                                                        maxWidth: '200px',
                                                        maxHeight: '200px',
                                                        objectFit: 'contain',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '8px',
                                                        padding: '10px',
                                                        background: '#f8f9fa'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="col-xl-3 col-lg-3 col-md-6">
                                        <div className="form-group">
                                            <label>Display Order</label>
                                            <input
                                                className="form-control"
                                                name="display_order"
                                                type="number"
                                                value={formData.display_order}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                            />
                                            <small className="text-muted">Lower numbers appear first</small>
                                        </div>
                                    </div>
                                    
                                    <div className="col-xl-3 col-lg-3 col-md-6">
                                        <div className="form-check mt-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="is_featured"
                                                checked={formData.is_featured}
                                                onChange={handleInputChange}
                                                id="isFeatured"
                                            />
                                            <label className="form-check-label" htmlFor="isFeatured">
                                                Featured Company
                                            </label>
                                            <small className="d-block text-muted">Show on homepage</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-left mt-3">
                                    <button type="submit" className="site-button m-r5" disabled={saving}>
                                        {saving ? 'Saving...' : editMode ? 'Update Company' : 'Add Company'}
                                    </button>
                                    <button
                                        type="button"
                                        className="site-button outline-primary"
                                        onClick={handleCancelForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Companies Table */}
            <div className="twm-pro-view-chart-wrap">
                <div className="col-lg-12 col-md-12 mb-4">
                    <div className="panel panel-default site-bg-white m-t30">
                        <div className="panel-heading wt-panel-heading p-a20">
                            <h4 className="panel-tittle m-a0">
                                <i className="fa fa-list" /> All Companies ({filteredCompanies.length})
                            </h4>
                        </div>
                        <div className="panel-body wt-panel-body">
                            <div className="p-a20 pb-3">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by company name or website..."
                                                    value={searchTerm}
                                                    onChange={e => setSearchTerm(e.target.value)}
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
                                <table className="table table-bordered twm-bookmark-list-wrap">
                                    <thead>
                                        <tr>
                                            <th>Sl No.</th>
                                            <th>Logo</th>
                                            <th>Company Name</th>
                                            <th>Website</th>
                                            <th>Featured</th>
                                            <th>Display Order</th>
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
                                                                ? `No companies found matching "${searchTerm}"`
                                                                : "No companies found. Add your first company!"}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentRecords.map((company, index) => {
                                                const serialNumber = indexOfFirstRecord + index + 1;
                                                const logoUrl = company.logo?.startsWith('http')
                                                    ? company.logo
                                                    : `http://localhost:8000${company.logo}`;
                                                
                                                return (
                                                    <tr key={company.id}>
                                                        <td>
                                                            <span className="badge bg-secondary">{serialNumber}</span>
                                                        </td>
                                                        <td>
                                                            {company.logo ? (
                                                                <img
                                                                    src={logoUrl}
                                                                    alt={company.name}
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '60px',
                                                                        objectFit: 'contain',
                                                                        borderRadius: '4px',
                                                                        border: '1px solid #eee',
                                                                        padding: '5px'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-muted">No logo</span>
                                                            )}
                                                        </td>
                                                        <td><strong>{company.name}</strong></td>
                                                        <td>
                                                            {company.website_url ? (
                                                                <a
                                                                    href={company.website_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary"
                                                                >
                                                                    <i className="fa fa-external-link-alt"></i> Visit
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted">-</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {company.is_featured ? (
                                                                <span className="badge bg-success">
                                                                    <i className="fa fa-check"></i> Yes
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-secondary">No</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-info">{company.display_order}</span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                title="Edit"
                                                                className="btn-icon"
                                                                onClick={() => handleEdit(company)}
                                                                style={{
                                                                    background: "none",
                                                                    border: "none",
                                                                    padding: "4px",
                                                                    marginRight: "4px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <i
                                                                    className="fa fa-edit"
                                                                    style={{
                                                                        color: "#2563eb",
                                                                        fontSize: "1.5rem"
                                                                    }}
                                                                />
                                                            </button>
                                                            <button
                                                                title="Delete"
                                                                className="btn-icon"
                                                                onClick={() => handleDelete(company.id, company.name)}
                                                                style={{
                                                                    background: "none",
                                                                    border: "none",
                                                                    padding: "9px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <i
                                                                    className="fa fa-trash-alt"
                                                                    style={{
                                                                        color: "#2563eb",
                                                                        fontSize: "1.5rem"
                                                                    }}
                                                                />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>Sl No.</th>
                                            <th>Logo</th>
                                            <th>Company Name</th>
                                            <th>Website</th>
                                            <th>Featured</th>
                                            <th>Display Order</th>
                                            <th>Action</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            {filteredCompanies.length > 0 && (
                                <div className="p-a20" style={{ borderTop: "1px solid #dee2e6" }}>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
                                                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredCompanies.length)} of {filteredCompanies.length} entries
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
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>
                                                    {[...Array(totalPages)].map((_, index) => {
                                                        const pageNumber = index + 1;
                                                        return (
                                                            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                                                <button
                                                                    className="page-link"
                                                                    onClick={() => paginate(pageNumber)}
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
    );
}

export default AdminTopCompany;
