import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";


function AdminPostAJobPage() {
    const { token } = useAuth(); // ← Get token from context
    const [categories, setCategories] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [form, setForm] = useState({
        title: "",
        category: "",
        job_type: "",
        offered_salary: "",
        experience: "",
        qualification: "",
        gender: "",
        country: "",
        city: "",
        location: "",
        latitude: "",
        longitude: "",
        email: "",
        website: "",
        est_since: "",
        complete_address: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    // Populate selects
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/categories/")
            .then(res => {
                setCategories(res.data);
                console.log('Categories loaded:', res.data);
            })
            .catch(err => console.error('Error loading categories:', err));

        axios.get("http://127.0.0.1:8000/api/job-type/")
            .then(res => {
                setJobTypes(res.data);
                console.log('Job types loaded:', res.data);
            })
            .catch(err => console.error('Error loading job types:', err));
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    // Handle form submit
    async function handleSubmit(e) {
        e.preventDefault();

        // Check if token exists
        if (!token) {
            alert("You are not logged in as admin. Please log in first.");
            return;
        }

        const cleanedData = {
            ...form,
            offered_salary: form.offered_salary || null,
            experience: form.experience || null,
            qualification: form.qualification || null,
            location: form.location || null,
            latitude: form.latitude || null,
            longitude: form.longitude || null,
            website: form.website || null,
            est_since: form.est_since || null,
            complete_address: form.complete_address || null,
            start_date: form.start_date || null,
            end_date: form.end_date || null,
            category: form.category ? parseInt(form.category) : null,
            job_type: form.job_type ? parseInt(form.job_type) : null,
        };

        console.log('Submitting data:', cleanedData);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/jobs/",
                cleanedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // ← Use token from context
                    }
                }
            );
            console.log('Success response:', response.data);
            alert("Job posted successfully!");

            // Reset form
            setForm({
                title: "",
                category: "",
                job_type: "",
                offered_salary: "",
                experience: "",
                qualification: "",
                gender: "",
                country: "",
                city: "",
                location: "",
                latitude: "",
                longitude: "",
                email: "",
                website: "",
                est_since: "",
                complete_address: "",
                description: "",
                start_date: "",
                end_date: "",
            });
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);

            const errorMessage = error.response?.data 
                ? JSON.stringify(error.response.data, null, 2)
                : error.message;
            alert(`There was an error posting the job!\n\n${errorMessage}`);
        }
    }

    return (
        <>
            <div className="wt-admin-right-page-header clearfix">
                <h2>Post a Job</h2>
                <div className="breadcrumbs">
                    <a href="#">Home</a>
                    <a href="#">Dashboard</a>
                    <span>Job Submission Form</span>
                </div>
            </div>
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0"><i className="fa fa-suitcase" />Job Details</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="row">
                            {/* Job title */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Job Title</label>
                                    <div className="ls-inputicon-box">
                                        <input name="title" className="form-control" type="text" placeholder="Job Title"
                                            value={form.title} onChange={handleChange} required />
                                        <i className="fs-input-icon fa fa-address-card" />
                                    </div>
                                </div>
                            </div>
                            {/* Job Category */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group city-outer-bx has-feedback">
                                    <label>Job Category</label>
                                    <div className="ls-inputicon-box">
                                        <select
                                            name="category"
                                            className="form-control"
                                            value={form.category || ""}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.length === 0 && <option disabled>Loading...</option>}
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <i className="fs-input-icon fa fa-border-all" />
                                    </div>
                                </div>
                            </div>
                            {/* Job Type */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Job Type</label>
                                    <div className="ls-inputicon-box">
                                        <select
                                            name="job_type"
                                            className="form-control"
                                            value={form.job_type || ""}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            {jobTypes.length === 0 && <option disabled>Loading...</option>}
                                            {jobTypes.map(jt => (
                                                <option key={jt.id} value={jt.id}>{jt.name}</option>
                                            ))}
                                        </select>
                                        <i className="fs-input-icon fa fa-file-alt" />
                                    </div>
                                </div>
                            </div>
                            {/* Offered Salary */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Offered Salary</label>
                                    <div className="ls-inputicon-box">
                                        <input name="offered_salary" className="form-control" type="text"
                                            placeholder="e.g. $3000"
                                            value={form.offered_salary} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-dollar-sign" />
                                    </div>
                                </div>
                            </div>
                            {/* Experience */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Experience</label>
                                    <div className="ls-inputicon-box">
                                        <input name="experience" className="form-control" type="text"
                                            placeholder="E.g. Minimum 3 years"
                                            value={form.experience} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-user-edit" />
                                    </div>
                                </div>
                            </div>
                            {/* Qualification */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Qualification</label>
                                    <div className="ls-inputicon-box">
                                        <input name="qualification" className="form-control" type="text"
                                            placeholder="Qualification Title"
                                            value={form.qualification} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-user-graduate" />
                                    </div>
                                </div>
                            </div>
                            {/* Gender */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <div className="ls-inputicon-box">
                                        <select
                                            name="gender"
                                            className="form-control"
                                            value={form.gender}
                                            onChange={handleChange}
                                            required>
                                            <option value="">Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Any">Any</option>
                                        </select>
                                        <i className="fs-input-icon fa fa-venus-mars" />
                                    </div>
                                </div>
                            </div>
                            {/* Country */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Country</label>
                                    <div className="ls-inputicon-box">
                                        <input name="country" className="form-control" type="text"
                                            placeholder="Country"
                                            value={form.country} onChange={handleChange} required />
                                        <i className="fs-input-icon fa fa-globe-americas" />
                                    </div>
                                </div>
                            </div>
                            {/* City */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>City</label>
                                    <div className="ls-inputicon-box">
                                        <input name="city" className="form-control" type="text"
                                            placeholder="City"
                                            value={form.city} onChange={handleChange} required />
                                        <i className="fs-input-icon fa fa-map-marker-alt" />
                                    </div>
                                </div>
                            </div>
                            {/* Location */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="ls-inputicon-box">
                                        <input name="location" className="form-control" type="text"
                                            placeholder="Type Address"
                                            value={form.location} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-map-marker-alt" />
                                    </div>
                                </div>
                            </div>
                            {/* Latitude */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Latitude</label>
                                    <div className="ls-inputicon-box">
                                        <input name="latitude" className="form-control" type="text"
                                            placeholder="Latitude"
                                            value={form.latitude} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-map-pin" />
                                    </div>
                                </div>
                            </div>
                            {/* Longitude */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Longitude</label>
                                    <div className="ls-inputicon-box">
                                        <input name="longitude" className="form-control" type="text"
                                            placeholder="Longitude"
                                            value={form.longitude} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-map-pin" />
                                    </div>
                                </div>
                            </div>
                            {/* Email Address */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="ls-inputicon-box">
                                        <input name="email" className="form-control" type="email"
                                            placeholder="your@email.com"
                                            value={form.email} onChange={handleChange} required />
                                        <i className="fs-input-icon fas fa-at" />
                                    </div>
                                </div>
                            </div>
                            {/* Website */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Website</label>
                                    <div className="ls-inputicon-box">
                                        <input name="website" className="form-control" type="url"
                                            placeholder="https://..."
                                            value={form.website} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-globe-americas" />
                                    </div>
                                </div>
                            </div>
                            {/* Est. Since */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Est. Since</label>
                                    <div className="ls-inputicon-box">
                                        <input name="est_since" className="form-control" type="text"
                                            placeholder="Since..."
                                            value={form.est_since} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-clock" />
                                    </div>
                                </div>
                            </div>
                            {/* Complete Address */}
                            <div className="col-xl-12 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Complete Address</label>
                                    <div className="ls-inputicon-box">
                                        <input name="complete_address" className="form-control" type="text"
                                            placeholder="Full address here..." value={form.complete_address} onChange={handleChange} />
                                        <i className="fs-input-icon fa fa-home" />
                                    </div>
                                </div>
                            </div>
                            {/* Description */}
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" className="form-control" rows={3} placeholder="Job description"
                                        value={form.description} onChange={handleChange} required></textarea>
                                </div>
                            </div>
                            {/* Start Date */}
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <div className="ls-inputicon-box">
                                        <input name="start_date" className="form-control" type="date"
                                            value={form.start_date} onChange={handleChange} />
                                        <i className="fs-input-icon far fa-calendar" />
                                    </div>
                                </div>
                            </div>
                            {/* End Date */}
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>End Date</label>
                                    <div className="ls-inputicon-box">
                                        <input name="end_date" className="form-control" type="date"
                                            value={form.end_date} onChange={handleChange} />
                                        <i className="fs-input-icon far fa-calendar" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button type="submit" className="site-button m-r5">Publish Job</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default AdminPostAJobPage;
