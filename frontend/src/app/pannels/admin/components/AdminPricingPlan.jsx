import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

const API_URL = "http://localhost:8000/api";

function AdminPricingPlan() {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        frequency: 'Monthly',
        features: '',
        recommended: false
    });

    // Edit mode
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPlans, setFilteredPlans] = useState([]);

    // Loading (saving)
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    useEffect(() => {
        filterPlans();
    }, [searchTerm, plans]);

    // Fetch pricing plans
    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            const response = await axios.get(`${API_URL}/pricing-plans/`, { headers });
            setPlans(response.data);
        } catch (error) {
            alert('❌ ERROR: Failed to load pricing plans.');
        } finally {
            setLoading(false);
        }
    };

    // Search & filter
    const filterPlans = () => {
        if (!searchTerm.trim()) {
            setFilteredPlans(plans);
            setCurrentPage(1);
        } else {
            const searchLower = searchTerm.toLowerCase();
            const filtered = plans.filter(plan =>
                plan.name.toLowerCase().includes(searchLower) ||
                plan.frequency.toLowerCase().includes(searchLower)
            );
            setFilteredPlans(filtered);
            setCurrentPage(1);
        }
    };

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredPlans.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredPlans.length / recordsPerPage);

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

    // Features as JSON
    const handleFeaturesChange = e => setFormData({ ...formData, features: e.target.value });

    // Add/Edit Submit
    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.price) {
            alert('⚠️ Plan name and price required');
            return;
        }
        let featuresArr = [];
        try {
            featuresArr = JSON.parse(formData.features);
            if (!Array.isArray(featuresArr)) throw new Error();
        } catch {
            alert('❌ Features must be valid JSON array');
            return;
        }
        setSaving(true);
        const token = localStorage.getItem('access_token');
        const data = {
            ...formData, features: featuresArr
        };
        try {
            if (editMode) {
                await axios.put(`${API_URL}/pricing-plans/${editId}/`, data, { headers: { 'Authorization': `Bearer ${token}` } });
                alert('✅ Plan updated!');
            } else {
                await axios.post(`${API_URL}/pricing-plans/`, data, { headers: { 'Authorization': `Bearer ${token}` } });
                alert('✅ Plan added!');
            }
            setFormData({ name: '', price: '', frequency: 'Monthly', features: '', recommended: false });
            setEditMode(false);
            setEditId(null);
            setShowForm(false);
            fetchPlans();
        } catch (error) {
            alert('❌ Error saving plan.');
        } finally {
            setSaving(false);
        }
    };

    // Edit handler
    const handleEdit = (plan) => {
        console.log("Edit clicked", plan);
        setFormData({
            name: plan.name,
            price: plan.price,
            frequency: plan.frequency,
            features: JSON.stringify(plan.features, null, 2),
            recommended: !!plan.recommended
        });
        setEditMode(true);
        setEditId(plan.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id, name) => {
        console.log("Delete clicked", id);
        if (!window.confirm(`Delete ${name} plan?`)) return;
        const token = localStorage.getItem("access_token");
        await axios.delete(`${API_URL}/pricing-plans/${id}/`, { headers: { "Authorization": `Bearer ${token}` } });
        fetchPlans();
    };


    // Cancel form
    const handleCancelForm = () => {
        setFormData({ name: '', price: '', frequency: 'Monthly', features: '', recommended: false });
        setEditMode(false);
        setEditId(null);
        setShowForm(false);
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
                <h2>Pricing Plans</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Pricing Plans</span>
                </div>
            </div>

            {/* Add Pricing Plan Button */}
            {!showForm && (
                <div className="mb-4">
                    <button className="site-button" onClick={() => setShowForm(true)}>
                        <i className="fa fa-plus"></i> Add New Plan
                    </button>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="col-lg-12 col-md-12 mb-4">
                    <div className="panel panel-default site-bg-white">
                        <div className="panel-heading wt-panel-heading p-a20">
                            <h4 className="panel-tittle m-a0">
                                <i className="fa fa-edit" /> {editMode ? 'Edit Plan' : 'Add New Plan'}
                            </h4>
                        </div>
                        <div className="panel-body wt-panel-body p-a20">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-xl-4 col-lg-4 col-md-12">
                                        <div className="form-group">
                                            <label>Plan Name <span className="text-danger">*</span></label>
                                            <select className="form-control" name="name"
                                                value={formData.name} onChange={handleInputChange} required>
                                                <option value="">Select Plan</option>
                                                <option value="Basic">Basic</option>
                                                <option value="Standard">Standard</option>
                                                <option value="Extended">Extended</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-3 col-md-12">
                                        <div className="form-group">
                                            <label>Price <span className="text-danger">*</span></label>
                                            <input className="form-control" name="price" type="number"
                                                value={formData.price} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-lg-3 col-md-12">
                                        <div className="form-group">
                                            <label>Frequency</label>
                                            <input className="form-control" name="frequency"
                                                value={formData.frequency} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="col-xl-2 col-lg-2 col-md-12">
                                        <div className="form-check mt-4">
                                            <input className="form-check-input" type="checkbox"
                                                name="recommended"
                                                checked={formData.recommended}
                                                onChange={handleInputChange} />
                                            <label className="form-check-label">Recommended</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <label>Features (JSON array)</label>
                                            <textarea className="form-control"
                                                name="features"
                                                rows={4}
                                                value={formData.features}
                                                onChange={handleFeaturesChange}
                                                placeholder='e.g. [{"feature": "1 job posting", "available": true}]'
                                                required></textarea>
                                            <small className="text-muted">Paste valid JSON array here.</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <button type="submit" className="site-button m-r5" disabled={saving}>
                                        {saving ? 'Saving...' : editMode ? 'Update Plan' : 'Add Plan'}
                                    </button>
                                    <button type="button" className="site-button outline-primary"
                                        onClick={handleCancelForm}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Pricing Plans Table */}
            <div className="twm-pro-view-chart-wrap">
                <div className="col-lg-12 col-md-12 mb-4">
                    <div className="panel panel-default site-bg-white m-t30">
                        <div className="panel-heading wt-panel-heading p-a20">
                            <h4 className="panel-tittle m-a0">
                                <i className="fa fa-list" /> All Plans ({filteredPlans.length})
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
                                                    placeholder="Search by name or frequency..."
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
                                            <th>Plan Name</th>
                                            <th>Price</th>
                                            <th>Frequency</th>
                                            <th>Recommended</th>
                                            <th>Features Preview</th>
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
                                                                ? `No plans found matching "${searchTerm}"`
                                                                : "No pricing plans found. Add your first plan!"}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentRecords.map((plan, index) => {
                                                const serialNumber = indexOfFirstRecord + index + 1;
                                                return (
                                                    <tr key={plan.id}>
                                                        <td>
                                                            <span className="badge bg-secondary">{serialNumber}</span>
                                                        </td>
                                                        <td>{plan.name}</td>
                                                        <td>${plan.price}</td>
                                                        <td>{plan.frequency}</td>
                                                        <td>{plan.recommended ? "Yes" : ""}</td>
                                                        <td>
                                                            <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
                                                                {(Array.isArray(plan.features)
                                                                    ? plan.features
                                                                    : []
                                                                ).map((f, i) => (
                                                                    <li key={i}>
                                                                        {f.available ? (
                                                                            <i className="feather-check text-success" />
                                                                        ) : (
                                                                            <i className="feather-x text-danger" />
                                                                        )}{" "}
                                                                        {f.feature}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                        <td>
                                                            <button
                                                                title="Edit"
                                                                className="btn-icon"
                                                                onClick={() => handleEdit(plan)}
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
                                                                onClick={() => handleDelete(plan.id, plan.name)}
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
                                            <th>Plan Name</th>
                                            <th>Price</th>
                                            <th>Frequency</th>
                                            <th>Recommended</th>
                                            <th>Features Preview</th>
                                            <th>Action</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            {/* Pagination */}
                            {filteredPlans.length > 0 && (
                                <div className="p-a20" style={{ borderTop: "1px solid #dee2e6" }}>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
                                                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredPlans.length)} of {filteredPlans.length} entries
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
                                                        >Previous</button>
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
                                                        >Next</button>
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

export default AdminPricingPlan;
