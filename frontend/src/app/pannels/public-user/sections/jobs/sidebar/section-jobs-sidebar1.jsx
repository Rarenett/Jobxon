import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../../globals/route-names";
import SectionSideAdvert from "./section-side-advert";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

function SectionJobsSidebar1({ onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    // All filter states - ALL ENABLED
    const [selectedCategory, setSelectedCategory] = useState("");
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [datePosted, setDatePosted] = useState("");
    const [employmentType, setEmploymentType] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            try {
                const [categoriesRes, jobTypesRes] = await Promise.all([
                    axios.get(`${API_URL}/categories/`),
                    axios.get(`${API_URL}/job-type/`)
                ]);
                
                console.log("Categories loaded:", categoriesRes.data);
                console.log("Job types loaded:", jobTypesRes.data);
                
                setCategories(categoriesRes.data);
                setJobTypes(jobTypesRes.data);
            } catch (error) {
                console.error('Error fetching filters data:', error);
                setCategories([]);
                setJobTypes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Refresh selectpicker after categories load
    useEffect(() => {
        if (!loading && categories.length > 0) {
            if (window.$ && window.$('.selectpicker').selectpicker) {
                window.$('.selectpicker').selectpicker('refresh');
            }
        }
    }, [loading, categories]);

    // Notify parent component whenever any filter changes
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                category: selectedCategory,
                keyword: keyword,
                location: location,
                jobTypes: selectedJobTypes,
                datePosted: datePosted,
                employmentType: employmentType
            });
        }
    }, [selectedCategory, keyword, location, selectedJobTypes, datePosted, employmentType, onFilterChange]);

    // Handle category change
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Handle keyword search
    const handleKeywordSearch = (e) => {
        if (e) e.preventDefault();
        // Keyword is already tracked in state, parent will be notified via useEffect
    };

    // Handle location search
    const handleLocationSearch = (e) => {
        if (e) e.preventDefault();
        // Location is already tracked in state, parent will be notified via useEffect
    };

    // Handle job type checkbox (multiple selection)
    const handleJobTypeChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        
        let updatedTypes;
        if (checked) {
            updatedTypes = [...selectedJobTypes, value];
        } else {
            updatedTypes = selectedJobTypes.filter(type => type !== value);
        }
        
        setSelectedJobTypes(updatedTypes);
    };

    // Handle date posted filter
    const handleDatePostedChange = (e) => {
        setDatePosted(e.target.value);
    };

    // Handle employment type filter
    const handleEmploymentTypeChange = (e) => {
        setEmploymentType(e.target.value);
    };

    return (
        <>
            <div className="side-bar">
                <div className="sidebar-elements search-bx">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Category Filter - ENABLED */}
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Category</h4>
                            <select 
                                className="wt-select-bar-large selectpicker" 
                                data-live-search="true" 
                                data-bv-field="size"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
                                <option value="">All Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Keyword Search - ENABLED */}
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Keyword</h4>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Job title or Keyword" 
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleKeywordSearch();
                                        }
                                    }}
                                />
                                <button 
                                    className="btn" 
                                    type="button"
                                    onClick={handleKeywordSearch}
                                >
                                    <i className="feather-search" />
                                </button>
                            </div>
                        </div>

                        {/* Location Search - ENABLED */}
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Location</h4>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search location" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleLocationSearch();
                                        }
                                    }}
                                />
                                <button 
                                    className="btn" 
                                    type="button"
                                    onClick={handleLocationSearch}
                                >
                                    <i className="feather-map-pin" />
                                </button>
                            </div>
                        </div>

                        {/* Job Type Filter - ENABLED */}
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Job Type</h4>
                            <ul>
                                {loading ? (
                                    <li>Loading...</li>
                                ) : jobTypes.length > 0 ? (
                                    jobTypes.map((type) => (
                                        <li key={type.id}>
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input" 
                                                    id={`jobType${type.id}`}
                                                    value={type.id}
                                                    checked={selectedJobTypes.includes(String(type.id))}
                                                    onChange={handleJobTypeChange}
                                                />
                                                <label 
                                                    className="form-check-label" 
                                                    htmlFor={`jobType${type.id}`}
                                                >
                                                    {type.name}
                                                </label>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No job types</li>
                                )}
                            </ul>
                        </div>

                        {/* Date Posts Filter - ENABLED */}
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Date Posts</h4>
                            <ul>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="lastHour"
                                            name="datePosted"
                                            value="1h"
                                            checked={datePosted === "1h"}
                                            onChange={handleDatePostedChange}
                                        />
                                        <label className="form-check-label" htmlFor="lastHour">
                                            Last hour
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="last24hours"
                                            name="datePosted"
                                            value="24h"
                                            checked={datePosted === "24h"}
                                            onChange={handleDatePostedChange}
                                        />
                                        <label className="form-check-label" htmlFor="last24hours">
                                            Last 24 hours
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="last7days"
                                            name="datePosted"
                                            value="7d"
                                            checked={datePosted === "7d"}
                                            onChange={handleDatePostedChange}
                                        />
                                        <label className="form-check-label" htmlFor="last7days">
                                            Last 7 days
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="last14days"
                                            name="datePosted"
                                            value="14d"
                                            checked={datePosted === "14d"}
                                            onChange={handleDatePostedChange}
                                        />
                                        <label className="form-check-label" htmlFor="last14days">
                                            Last 14 days
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="last30days"
                                            name="datePosted"
                                            value="30d"
                                            checked={datePosted === "30d"}
                                            onChange={handleDatePostedChange}
                                        />
                                        <label className="form-check-label" htmlFor="last30days">
                                            Last 30 days
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="allDates"
                                            name="datePosted"
                                            value=""
                                            checked={datePosted === ""}
                                            onChange={handleDatePostedChange}
                                        />
                                        <label className="form-check-label" htmlFor="allDates">
                                            All
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Type of Employment Filter - ENABLED */}
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Type of employment</h4>
                            <ul>
                                {loading ? (
                                    <li>Loading...</li>
                                ) : jobTypes.length > 0 ? (
                                    jobTypes.map((type) => (
                                        <li key={`employment-${type.id}`}>
                                            <div className="form-check">
                                                <input 
                                                    type="radio" 
                                                    className="form-check-input" 
                                                    id={`employment${type.id}`}
                                                    name="employmentType"
                                                    value={type.id}
                                                    checked={employmentType === String(type.id)}
                                                    onChange={handleEmploymentTypeChange}
                                                />
                                                <label 
                                                    className="form-check-label" 
                                                    htmlFor={`employment${type.id}`}
                                                >
                                                    {type.name}
                                                </label>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No types</li>
                                )}
                            </ul>
                        </div>
                    </form>
                </div>

                <div className="widget tw-sidebar-tags-wrap">
                    <h4 className="section-head-small mb-4">Tags</h4>
                    <div className="tagcloud">
                        <NavLink to={publicUser.jobs.LIST}>General</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Jobs</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Payment</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Application</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Work</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Recruiting</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Employer</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Income</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Tips</NavLink>
                    </div>
                </div>
            </div>
            <SectionSideAdvert />
        </>
    );
}

export default SectionJobsSidebar1;
