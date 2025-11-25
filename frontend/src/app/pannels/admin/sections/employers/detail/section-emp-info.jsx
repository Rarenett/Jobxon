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
        alert( (profile.is_verified ? "Marked as Not Verified" : "Marked as Verified") || response.data.message);
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
        alert( (profile.is_favourite ? "Removed from Favorites" : "Added to Favorites" || response.data.message));
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
            setShowReviewForm(false);
            setReview({ rating: 5, review_title: '', review_content: '' });
            fetchProfile();
        } catch (error) {
            alert('Failed to submit review');
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
                <div className="overlay-main site-bg-primary" style={{opacity:0.2}}/>
                <div className="twm-top-wide-banner-content container ">
                    <div className="twm-mid-content">
                        <div className="twm-employer-self-top">
                            <div className="twm-media">
                                <img style={{width:"90px", height:"90px"}} src={getImageUrl(profile.logo)} alt={profile.name || "#"} />
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
                                    <i className="fa fa-hand-o-right" /> Add Review
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
                            <div className="review-form-dropdown" style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                marginTop: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}>
                                <h4 style={{ color: '#333', marginBottom: '15px' }}>Add Your Review</h4>
                                <form onSubmit={handleSubmitReview}>
                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label style={{ color: '#333', display: 'block', marginBottom: '5px' }}>
                                            Rating (1-5)
                                        </label>
                                        <select
                                            name="rating"
                                            value={review.rating}
                                            onChange={handleReviewChange}
                                            className="form-control"
                                            required
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label style={{ color: '#333', display: 'block', marginBottom: '5px' }}>
                                            Review Title
                                        </label>
                                        <input
                                            type="text"
                                            name="review_title"
                                            value={review.review_title}
                                            onChange={handleReviewChange}
                                            className="form-control"
                                            placeholder="Enter review title"
                                            maxLength="200"
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '15px' }}>
                                        <label style={{ color: '#333', display: 'block', marginBottom: '5px' }}>
                                            Review Content
                                        </label>
                                        <textarea
                                            name="review_content"
                                            value={review.review_content}
                                            onChange={handleReviewChange}
                                            className="form-control"
                                            rows="4"
                                            placeholder="Write your review here..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="site-button"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
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
