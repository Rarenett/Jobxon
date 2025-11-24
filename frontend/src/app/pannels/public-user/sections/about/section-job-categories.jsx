import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../globals/route-names";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function SectionJobCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories/`);
                // Get first 8 categories for display
                setCategories(response.data.slice(0, 8));
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area2">
                <div className="container">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading categories...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area2">
                <div className="container">
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="section-full p-t120 p-b90 site-bg-gray twm-job-categories-area2">
                {/* title START*/}
                <div className="section-head center wt-small-separator-outer">
                    <div className="wt-small-separator site-text-primary">
                        <div>Jobs by Categories</div>
                    </div>
                    <h2 className="wt-title">Choose Your Desire Category</h2>
                </div>
                {/* title END*/}
                <div className="container">
                    <div className="twm-job-categories-section-2 m-b30">
                        <div className="job-categories-style1 m-b30">
                            <div className="row">
                                {categories.length === 0 ? (
                                    <div className="col-12 text-center">
                                        <p>No categories available at the moment.</p>
                                    </div>
                                ) : (
                                    categories.map((category) => (
                                        <div className="col-lg-3 col-md-6" key={category.id}>
                                            <div className="job-categories-block-2 m-b30">
                                                <div className="twm-media">
                                                    {/* Use FontAwesome icon with color #1967d2 or fallback to flaticon */}
                                                    {category.icon ? (
                                                        <i 
                                                            className={category.icon} 
                                                            style={{ 
                                                                fontSize: '48px',
                                                                color: '#1967d2'
                                                            }}
                                                        ></i>
                                                    ) : (
                                                        <div 
                                                            className="flaticon-briefcase"
                                                            style={{ color: '#1967d2' }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="twm-content">
                                                    <div className="twm-jobs-available">
                                                        {category.job_count || 0} Jobs
                                                    </div>
                                                    <NavLink to={`${publicUser.jobs.GRID}?category=${category.slug}`}>
                                                        {category.name}
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="text-center job-categories-btn">
                            <NavLink to={publicUser.jobs.GRID} className="site-button">
                                All Categories
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SectionJobCategories;
