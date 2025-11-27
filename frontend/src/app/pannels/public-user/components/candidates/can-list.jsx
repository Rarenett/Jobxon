import { useEffect, useState } from "react";
import JobZImage from "../../../../common/jobz-img";
import { useAuth } from "../../../../../contexts/AuthContext";


const API_URL = process.env.REACT_APP_API_URL;
console.log("hello")

function AdminCandidateListPage() {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState([]);

    const { user } = useAuth();


    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const res = await fetch(`${API_URL}/api/admin/candidates/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                const list = Array.isArray(data) ? data : data.results || [];
                setCandidates(list);
                setFilteredCandidates(list);
            } catch (error) {
                console.error("Failed to load candidates", error);
                setCandidates([]);
                setFilteredCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    useEffect(() => {
        filterCandidates();
    }, [searchTerm, candidates]);

    const filterCandidates = () => {
        if (!searchTerm.trim()) {
            setFilteredCandidates(candidates);
            setCurrentPage(1);
        } else {
            const filtered = candidates.filter((candidate) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    candidate.full_name?.toLowerCase().includes(searchLower) ||
                    candidate.email?.toLowerCase().includes(searchLower) ||
                    candidate.phone?.toLowerCase().includes(searchLower) ||
                    candidate.city?.toLowerCase().includes(searchLower) ||
                    candidate.country?.toLowerCase().includes(searchLower) ||
                    candidate.experience?.toLowerCase().includes(searchLower)
                );
            });
            setFilteredCandidates(filtered);
            setCurrentPage(1);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredCandidates.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredCandidates.length / recordsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
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

    // ✅ View Candidate
    const viewCandidate = (id) => {
        window.location.href = `/admin/candidate-view/${id}`;
    };

    // ✅ Delete Candidate
    const deleteCandidate = async (id) => {
        const token = localStorage.getItem("access_token");

        if (!window.confirm("Are you sure you want to delete this candidate?")) return;

        try {
            const res = await fetch(
                `${API_URL}/api/admin-candidates/${id}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.ok) {
                alert("Deleted ✅");

                // ✅ remove from UI instantly
                const updated = candidates.filter(c => c.id !== id);
                setCandidates(updated);
                setFilteredCandidates(updated);
            } else {
                alert("Delete failed ❌");
            }
        } catch (err) {
            console.error(err);
            alert("Server error ❌");
        }
    };

  const startConversation = async (candidateUserId) => {
  console.log("candidateUserId:", candidateUserId); // <- add this
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(
      `${API_URL}/api/conversations/start_conversation/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: candidateUserId,
        }),
      }
    );
    const data = await res.json();
    console.log("start_conversation response:", data); // debug

    if (res.ok) {
      const basePath = user?.user_type === 'admin' ? '/admin' : '/employer';
      window.location.href = `${basePath}/messages-style-1?conversation=${data.id}`;
    } else {
      alert(data.error || "Failed to start conversation ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};


    return (
        <>
            <div>
                <div className="wt-admin-right-page-header clearfix">
                    <h2>Candidates</h2>
                    <div className="breadcrumbs">
                        <a href="#">Home</a>
                        <a href="#">Dashboard</a>
                        <span>Candidate List</span>
                    </div>
                </div>

                <div className="twm-pro-view-chart-wrap">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="panel panel-default site-bg-white m-t30">
                            <div className="panel-heading wt-panel-heading p-a20">
                                <h4 className="panel-tittle m-a0">
                                    <i className="far fa-user" /> Candidate List ({filteredCandidates.length})
                                </h4>
                            </div>

                            <div className="panel-body wt-panel-body">
                                {/* Filter and Search Controls */}
                                <div className="row align-items-center mb-3" style={{}}>
                                    {/* Entries per page dropdown */}
                                    <div className="col-md-6 d-flex align-items-center">
                                        <span style={{ marginRight: "8px" }}>Show</span>
                                        <select
                                            value={recordsPerPage}
                                            onChange={handleRecordsPerPageChange}
                                            style={{
                                                background: "#eef5ff",
                                                border: "none",
                                                padding: "8px",
                                                borderRadius: "8px",
                                                marginRight: "8px"
                                            }}
                                        >
                                            <option value={3}>3</option>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <span>entries</span>
                                    </div>
                                    {/* Search box */}
                                    <div className="col-md-6 d-flex justify-content-md-end mt-2 mt-md-0">
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <span style={{ marginRight: "8px" }}>Search:</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search candidates..."
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                style={{
                                                    background: "#eef5ff",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    width: "220px"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="twm-D_table p-a20 table-responsive">
                                    <table id="candidate_table" className="table table-bordered twm-bookmark-list-wrap">
                                        <thead>
                                            <tr>
                                                <th>Candidate Name</th>
                                                <th>Experience</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Status</th>
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
                                                                    ? `No candidates found matching "${searchTerm}"`
                                                                    : 'No candidates found'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentRecords.map((c, index) => {
                                                    console.log("Admin candidate row:", c); // 👈 full object

                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className="twm-bookmark-list">
                                                                    <div className="twm-media">
                                                                        <div className="twm-media-pic">
                                                                            <JobZImage
                                                                                src={c.profile_image || "images/candidates/default.jpg"}
                                                                                alt="#"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="twm-mid-content">
                                                                        <a href="#" className="twm-job-title">
                                                                            <h4>{c.full_name}</h4>
                                                                        </a>
                                                                        <p className="twm-bookmark-address">
                                                                            <i className="feather-map-pin" />
                                                                            {c.city}, {c.country}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <div className="twm-jobs-category">
                                                                    <span className="twm-bg-purple">
                                                                        {c.experience || "N/A"}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <div className="twm-job-post-duration">
                                                                    {c.phone || "N/A"}
                                                                </div>
                                                            </td>

                                                            <td>{c.email}</td>

                                                            <td>
                                                                <span className="text-clr-green2">Active</span>
                                                            </td>

                                                            <td>
                                                                <div className="twm-table-controls">
                                                                    <ul className="twm-DT-controls-icon list-unstyled">
                                                                        <li>
                                                                            <button
                                                                                title="View profile"
                                                                                onClick={() => viewCandidate(c.id)}
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                            >
                                                                                <span className="fa fa-eye" />
                                                                            </button>
                                                                        </li>

                                                                        <li>
                                                                            <button
                                                                                title="Send Message"
                                                                                onClick={() => {
                                                                                    console.log(
                                                                                        "Send Message clicked -> candidate.id:",
                                                                                        c.id,
                                                                                        "candidate.user_id:",
                                                                                        c.user_id
                                                                                    ); // 👈 check this
                                                                                    startConversation(c.user_id);
                                                                                }}
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
                                                                            >
                                                                                <span className="far fa-comment-dots" />
                                                                            </button>
                                                                        </li>

                                                                        <li>
                                                                            <button
                                                                                title="Delete"
                                                                                onClick={() => deleteCandidate(c.id)}
                                                                                data-bs-toggle="tooltip"
                                                                                data-bs-placement="top"
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
                                                <th>Candidate Name</th>
                                                <th>Experience</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {filteredCandidates.length > 0 && (
                                    <div className="p-a20" style={{ borderTop: '1px solid #dee2e6' }}>
                                        <div className="row align-items-center">
                                            {/* Left side - Showing entries text */}
                                            <div className="col-md-6">
                                                <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>
                                                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredCandidates.length)} of {filteredCandidates.length} entries
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

export default AdminCandidateListPage;
