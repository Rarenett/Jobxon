import { useEffect, useState } from "react";
import JobZImage from "../../../common/jobz-img";
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const APP_NAME = process.env.REACT_APP_APP_NAME || 'JobXon';

function AdminCompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

    useEffect(() => {
        fetchCompanies();
        fetchStats();
    }, [filterStatus]);

    useEffect(() => {
        if (!loading && companies.length > 0) {
            // Destroy any existing DataTable
            if ($.fn.DataTable.isDataTable('#companies_list_table')) {
                $('#companies_list_table').DataTable().destroy();
            }

            // Small delay to ensure DOM is ready
        }
    }, [loading, companies]);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/companies/`;
            const params = new URLSearchParams();
            if (filterStatus !== "all") {
                params.append('is_active', filterStatus === 'active');
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            } else {
                console.error('Failed to fetch companies. Status:', response.status);
                alert(`Failed to load companies (${response.status})`);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            alert('Error loading companies. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/companies/stats/`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDelete = async (companyId, companyName) => {
        if (window.confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(
                    `${API_URL}/api/companies/${companyId}/`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        }
                    }
                );

                if (response.ok || response.status === 204) {
                    alert('Company deleted successfully');
                    fetchCompanies();
                    fetchStats();
                } else {
                    alert('Failed to delete company');
                }
            } catch (error) {
                console.error('Error deleting company:', error);
                alert('Error deleting company');
            }
        }
    };

    const handleToggleStatus = async (companyId, currentStatus, companyName) => {
        const action = currentStatus ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} "${companyName}"?`)) {
            try {
                const response = await fetch(
                    `${API_URL}/api/companies/${companyId}/toggle_status/`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message || 'Status updated successfully');
                    fetchCompanies();
                    fetchStats();
                } else {
                    alert('Failed to update status');
                }
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Error updating status');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_URL}${imagePath}`;
    };

    return (
        <>
            <div>
                <div className="wt-admin-right-page-header clearfix">
                    <h2>Companies Management</h2>
                    <div className="breadcrumbs">
                        <a href="#">Home</a>
                        <a href="#">Dashboard</a>
                        <span>Companies</span>
                    </div>
                </div>

                <div className="twm-pro-view-chart-wrap">
                    <div className="row mb-4">
                        <div className="col-xl-4 col-lg-6 col-md-12 mb-4">
                            <div className="panel panel-default site-bg-white">
                                <div className="panel-body wt-panel-body p-a20">
                                    <div className="wt-icon-box-wraper left">
                                        <div className="icon-md site-text-primary">
                                            <i className="far fa-building"></i>
                                        </div>
                                        <div className="icon-content">
                                            <h4 className="m-b5 counter">{stats.total}</h4>
                                            <p>Total Companies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-12 mb-4">
                            <div className="panel panel-default site-bg-white">
                                <div className="panel-body wt-panel-body p-a20">
                                    <div className="wt-icon-box-wraper left">
                                        <div className="icon-md site-text-green">
                                            <i className="fa fa-check-circle"></i>
                                        </div>
                                        <div className="icon-content">
                                            <h4 className="m-b5 counter">{stats.active}</h4>
                                            <p>Active Companies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-12 mb-4">
                            <div className="panel panel-default site-bg-white">
                                <div className="panel-body wt-panel-body p-a20">
                                    <div className="wt-icon-box-wraper left">
                                        <div className="icon-md site-text-danger">
                                            <i className="fa fa-times-circle"></i>
                                        </div>
                                        <div className="icon-content">
                                            <h4 className="m-b5 counter">{stats.inactive}</h4>
                                            <p>Inactive Companies</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="twm-pro-view-chart-wrap">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white m-t30">
                            <div className="panel-heading wt-panel-heading p-a20">
                                <h4 className="panel-tittle m-a0">
                                    <i className="far fa-building" /> Registered Companies
                                </h4>
                            </div>

                            <div className="wt-admin-right-page-header p-a20">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>
                                            Filter by Status:
                                            <select
                                                className="form-control ml-2"
                                                style={{ width: 'auto', display: 'inline-block' }}
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                            >
                                                <option value="all">All Companies</option>
                                                <option value="active">Active Only</option>
                                                <option value="inactive">Inactive Only</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => {
                                                fetchCompanies();
                                                fetchStats();
                                            }}
                                        >
                                            <i className="fa fa-sync-alt"></i> Refresh
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="panel-body wt-panel-body">
                                {loading ? (
                                    <div className="text-center p-a20">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading companies...</p>
                                    </div>
                                ) : (
                                    <div className="twm-D_table p-a20 table-responsive" key={filterStatus}>
                                        <table 
                                            id="companies_list_table" 
                                            className="table table-bordered twm-bookmark-list-wrap"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>Company Details</th>
                                                    <th>Contact Info</th>
                                                    <th>Company Info</th>
                                                    <th>Photos</th>
                                                    <th>Registered On</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {companies.length > 0 ? (
                                                    companies.map((company) => (
                                                        <tr key={company.id}>
                                                            <td>
                                                                <div className="twm-bookmark-list">
                                                                    <div className="twm-media">
                                                                        <div className="twm-media-pic">
                                                                            {company.logo ? (
                                                                                <img 
                                                                                    src={getImageUrl(company.logo)} 
                                                                                    alt={company.name}
                                                                                    style={{
                                                                                        width: '90px',
                                                                                        height: '90px',
                                                                                        objectFit: 'cover',
                                                                                        borderRadius: '4px'
                                                                                    }}
                                                                                    onError={(e) => {
                                                                                        e.target.src = '/images/jobs-company/pic1.jpg';
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <JobZImage 
                                                                                    src="images/jobs-company/pic1.jpg" 
                                                                                    alt="#" 
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="twm-mid-content">
                                                                        <a href="#" className="twm-job-title">
                                                                            <h4>{company.name}</h4>
                                                                        </a>
                                                                        <p className="twm-bookmark-address">
                                                                            <i className="feather-map-pin" />
                                                                            {company.location || 'Location not specified'}
                                                                        </p>
                                                                        {company.website && (
                                                                            <a 
                                                                                href={company.website}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="twm-job-websites site-text-primary"
                                                                            >
                                                                                {company.website}
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-2">
                                                                    <strong>Email:</strong><br />
                                                                    <small>{company.email || 'N/A'}</small>
                                                                </div>
                                                                <div>
                                                                    <strong>Phone:</strong><br />
                                                                    <small>{company.phone || 'N/A'}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="mb-2">
                                                                    <strong>Team Size:</strong><br />
                                                                    <span className="badge badge-info" >
                                                                        {company.team_size || 'Not specified'}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <strong>Established:</strong><br />
                                                                    <span className="badge badge-secondary">
                                                                        {company.established_since || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="twm-jobs-category">
                                                                    <span className="twm-bg-purple">
                                                                        {company.photos?.length || 0} Photos
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td data-order={company.created_at}>
                                                                <div className="twm-job-post-duration">
                                                                    {formatDate(company.created_at)}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span 
                                                                    className={
                                                                        company.is_active 
                                                                            ? "badge badge-success" 
                                                                            : "badge badge-danger"
                                                                    }
                                                                    style={{
                                                                        fontSize: '12px',
                                                                        padding: '5px 10px'
                                                                    }}
                                                                >
                                                                    {company.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="twm-table-controls">
                                                                    <ul className="twm-DT-controls-icon list-unstyled">
                                                                        <li>
                                                                            <button
                                                                                title="View Details"
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                                onClick={() => {
                                                                                    window.location.href = `/admin/companies/${company.id}`;
                                                                                }}
                                                                            >
                                                                                <span className="fa fa-eye" />
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button
                                                                                title={
                                                                                    company.is_active 
                                                                                        ? "Deactivate Company" 
                                                                                        : "Activate Company"
                                                                                }
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                                onClick={() => handleToggleStatus(
                                                                                    company.id, 
                                                                                    company.is_active,
                                                                                    company.name
                                                                                )}
                                                                                style={{
                                                                                    color: company.is_active ? '#28a745' : '#6c757d'
                                                                                }}
                                                                            >
                                                                                <span className={
                                                                                    company.is_active 
                                                                                        ? "fa fa-toggle-on" 
                                                                                        : "fa fa-toggle-off"
                                                                                } />
                                                                            </button>
                                                                        </li>
                                                                        {/* <li>
                                                                            <button
                                                                                title="Edit Company"
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                                onClick={() => {
                                                                                    window.location.href = `/admin/companies/${company.id}/edit`;
                                                                                }}
                                                                            >
                                                                                <span className="fa fa-edit" />
                                                                            </button>
                                                                        </li> */}
                                                                        <li>
                                                                            <button
                                                                                title="Delete Company"
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                                onClick={() => handleDelete(
                                                                                    company.id,
                                                                                    company.name
                                                                                )}
                                                                                style={{ color: '#dc3545' }}
                                                                            >
                                                                                <span className="far fa-trash-alt" />
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center p-a20">
                                                            <div className="py-4">
                                                                <i className="far fa-building fa-3x text-muted mb-3"></i>
                                                                <h5 className="text-muted">No companies found</h5>
                                                                <p className="text-muted">No companies registered yet</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>Company Details</th>
                                                    <th>Contact Info</th>
                                                    <th>Company Info</th>
                                                    <th>Photos</th>
                                                    <th>Registered On</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </tfoot>
                                        </table>
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

export default AdminCompaniesPage;
