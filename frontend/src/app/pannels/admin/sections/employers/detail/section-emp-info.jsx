import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { publicUrlFor } from "../../../../../../globals/constants";
import axios from "axios";

const API_URL = "http://localhost:8000/api";
const IMG_BASE_URL = "http://localhost:8000";

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'images/jobs-company/pic1.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${IMG_BASE_URL}${imageUrl}`;
    return `${IMG_BASE_URL}/${imageUrl}`;
};

function SectionEmployerAdminInfo() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [review, setReview] = useState({
        rating: 5,
        review_title: '',
        review_content: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);

    const [existingReview, setExistingReview] = useState(null);


    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line
    }, [id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/companies/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(response.data);
            if (response.data.reviews && response.data.reviews.length > 0) {
                const latestReview = response.data.reviews[0]; // or find by user/admin
                setExistingReview(latestReview);
                // Pre-populate form with existing review
                setReview({
                    rating: latestReview.rating,
                    review_title: latestReview.review_title,
                    review_content: latestReview.review_content
                });
            } else {
                setExistingReview(null);
                setReview({ rating: 5, review_title: '', review_content: '' });
            }
        } catch (error) {
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerified = async () => {
        if (!profile) return;
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                `${API_URL}/companies/${id}/toggle_verified/`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            fetchProfile();
            alert((profile.is_verified ? "Marked as Not Verified" : "Marked as Verified") || response.data.message);
        } catch (error) {
            alert('Failed to update verification status');
        }
    };

    const toggleFavourite = async () => {
        if (!profile) return;
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                `${API_URL}/companies/${id}/toggle_favourite/`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            fetchProfile();
            alert((profile.is_favourite ? "Removed from Favorites" : "Added to Favorites" || response.data.message));
        } catch (error) {
            alert('Failed to update favourite status');
        }
    };

    const toggleViewed = async () => {
        if (!profile) return;
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.patch(
                `${API_URL}/companies/${id}/`,
                { is_viewed: !profile.is_viewed },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            fetchProfile();
            alert(profile.is_viewed ? "Marked as Not Viewed" : "Marked as Viewed");
        } catch (error) {
            alert('Failed to update viewed status');
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReview(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!review.review_title || !review.review_content) {
            alert('Please fill in all review fields');
            return;
        }

        setSubmittingReview(true);
        try {
            const token = localStorage.getItem('access_token');

            if (existingReview) {
                // UPDATE existing review
                await axios.put(
                    `${API_URL}/reviews/${existingReview.id}/`,
                    {
                        company: id,
                        rating: review.rating,
                        review_title: review.review_title,
                        review_content: review.review_content
                    },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                alert('Review updated successfully!');
            } else {
                // CREATE new review
                await axios.post(
                    `${API_URL}/reviews/`,
                    {
                        company: id,
                        rating: review.rating,
                        review_title: review.review_title,
                        review_content: review.review_content
                    },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                alert('Review submitted successfully!');
            }

            setShowReviewForm(false);
            fetchProfile(); // Refresh to show updated review
        } catch (error) {
            alert(existingReview ? 'Failed to update review' : 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };


    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading company profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="alert alert-warning text-center m-5">
                <h4>No Profile Found</h4>
                <p>Unable to load company profile. The company ID may be invalid.</p>
            </div>
        );
    }

    return (
        <>
            <div
                className="twm-top-wide-banner overlay-wraper"
                style={{ backgroundImage: `url(${getImageUrl(profile.banner_image) || publicUrlFor("images/detail-pic/company-bnr1.jpg")})` }}
            >
                <div className="overlay-main site-bg-primary" style={{ opacity: 0.2 }} />
                <div className="twm-top-wide-banner-content container ">
                    <div className="twm-mid-content">
                        <div className="twm-employer-self-top">
                            <div className="twm-media">
                                <img style={{ width: "90px", height: "90px" }} src={getImageUrl(profile.logo)} alt={profile.name || "#"} />
                            </div>
                            <h3 className="twm-job-title">{profile.name}</h3>
                            <p className="twm-employer-address"><i className="feather-map-pin" />{profile.address || profile.location || "No address"}</p>
                            {profile.website && (
                                <a href={profile.website} className="twm-employer-websites" target="_blank" rel="noopener noreferrer">
                                    {profile.website}
                                </a>
                            )}
                            {/* --- Button color classes and order preserved --- */}
                            <div className="twm-ep-detail-tags">
                                <button className="de-info twm-bg-green" onClick={toggleVerified}>
                                    <i className="fa fa-check" /> {profile.is_verified ? "Verified" : "Not Verified"}
                                </button>
                                <button className="de-info twm-bg-brown" onClick={toggleFavourite}>
                                    <i className="fa fa-heart" /> {profile.is_favourite ? "Favourited" : "Add To Favorite"}
                                </button>

                                <button className="de-info twm-bg-sky" onClick={toggleViewed}>
                                    <i className="fa fa-eye" /> {profile.is_viewed ? "Viewed" : "Mark as Viewed"}
                                </button>
                                <button className="de-info twm-bg-purple" onClick={() => setShowReviewForm(!showReviewForm)}>
                                    <i className="fa fa-pen" />
                                    {existingReview ? 'Edit Review' : 'Add Review'}
                                </button>

                            </div>
                        </div>
                        <div className="twm-employer-self-bottom">
                            <div className="twm-social-btns" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: "18px", marginBottom: "4px" }}>
                                {/* Your social links here */}
                                {profile.facebook && (
                                    <a className="btn facebook" href={profile.facebook} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-facebook-f" />
                                    </a>
                                )}
                                {profile.twitter && (
                                    <a className="btn twitter" href={profile.twitter} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-twitter" />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a className="btn linkedin" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-linkedin-in" />
                                    </a>
                                )}
                                {profile.whatsapp && (
                                    <a className="btn whatsapp" href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-whatsapp" />
                                    </a>
                                )}
                                {profile.instagram && (
                                    <a className="btn instagram" href={profile.instagram} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-instagram" />
                                    </a>
                                )}
                                {profile.youtube && (
                                    <a className="btn youtube" href={profile.youtube} target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-youtube" />
                                    </a>
                                )}
                            </div>

                        </div>
                        {showReviewForm && (
                            <>
                                {/* Modal Backdrop */}
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        zIndex: 9998,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setShowReviewForm(false)}
                                >
                                    {/* Modal Content */}
                                    <div
                                        style={{
                                            background: 'white',
                                            padding: '30px',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                            maxWidth: '500px',
                                            width: '90%',
                                            maxHeight: '80vh',
                                            overflowY: 'auto',
                                            position: 'relative'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Close Button (X) */}
                                        <button
                                            onClick={() => setShowReviewForm(false)}
                                            style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                background: 'transparent',
                                                border: 'none',
                                                fontSize: '24px',
                                                cursor: 'pointer',
                                                color: '#999',
                                                lineHeight: 1
                                            }}
                                            type="button"
                                        >
                                            ×
                                        </button>

                                        <h4 style={{
                                            color: '#333',
                                            marginBottom: '20px',
                                            fontSize: '24px',
                                            fontWeight: 'bold'
                                        }}>
                                            {existingReview ? 'Edit Your Review' : 'Add Your Review'}
                                        </h4>

                                        <form onSubmit={handleSubmitReview}>
                                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                                <label style={{
                                                    color: '#333',
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '500'
                                                }}>
                                                    Rating (1-5) <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    name="rating"
                                                    value={review.rating}
                                                    onChange={handleReviewChange}
                                                    className="form-control"
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                    required
                                                >
                                                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                                    <option value="4">⭐⭐⭐⭐ Very Good</option>
                                                    <option value="3">⭐⭐⭐ Good</option>
                                                    <option value="2">⭐⭐ Fair</option>
                                                    <option value="1">⭐ Poor</option>
                                                </select>
                                            </div>

                                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                                <label style={{
                                                    color: '#333',
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '500'
                                                }}>
                                                    Review Title <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="review_title"
                                                    value={review.review_title}
                                                    onChange={handleReviewChange}
                                                    className="form-control"
                                                    placeholder="Enter review title"
                                                    maxLength="200"
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #ddd'
                                                    }}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                                <label style={{
                                                    color: '#333',
                                                    display: 'block',
                                                    marginBottom: '8px',
                                                    fontWeight: '500'
                                                }}>
                                                    Review Content <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <textarea
                                                    name="review_content"
                                                    value={review.review_content}
                                                    onChange={handleReviewChange}
                                                    className="form-control"
                                                    rows="5"
                                                    placeholder="Write your detailed review here..."
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #ddd',
                                                        resize: 'vertical'
                                                    }}
                                                    required
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                justifyContent: 'flex-end',
                                                marginTop: '25px'
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowReviewForm(false);
                                                        // Reset to existing review data or empty
                                                        if (existingReview) {
                                                            setReview({
                                                                rating: existingReview.rating,
                                                                review_title: existingReview.review_title,
                                                                review_content: existingReview.review_content
                                                            });
                                                        } else {
                                                            setReview({ rating: 5, review_title: '', review_content: '' });
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #ddd',
                                                        background: '#f5f5f5',
                                                        color: '#333',
                                                        cursor: 'pointer',
                                                        fontWeight: '500',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.background = '#e0e0e0'}
                                                    onMouseOut={(e) => e.target.style.background = '#f5f5f5'}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="site-button"
                                                    disabled={submittingReview}
                                                    style={{
                                                        padding: '10px 20px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        cursor: submittingReview ? 'not-allowed' : 'pointer',
                                                        opacity: submittingReview ? 0.7 : 1
                                                    }}
                                                >
                                                    {submittingReview ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                            {existingReview ? 'Updating...' : 'Submitting...'}
                                                        </>
                                                    ) : (
                                                        existingReview ? 'Update Review' : 'Submit Review'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
                <div className="ani-circle-1 rotate-center" />
                <div className="ani-circle-2 rotate-center" />
            </div>
        </>
    );
}

export default SectionEmployerAdminInfo;
