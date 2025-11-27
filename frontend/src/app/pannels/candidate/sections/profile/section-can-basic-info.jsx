import { useState, useEffect } from "react";

function SectionCandicateBasicInfo() {

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        website: "",
        qualification: "",
        languages: "",
        job_category: "",
        experience: "",
        current_salary: "",
        expected_salary: "",
        age: "",
        country: "",
        city: "",
        postcode: "",
        full_address: "",
        description: "",
        profile_image: null,   // ✅ ADDED

    });

    const [loading, setLoading] = useState(false);

    // ✅ FETCH STORED DATA ON LOAD
const fetchSavedProfile = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
        const res = await fetch("http://127.0.0.1:8000/api/candidate-profile/get-basic-info/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (res.ok && data) {
            const updatedData = {
                full_name: data.full_name || "",
                phone: data.phone || "",
                email: data.email || "",
                website: data.website || "",
                qualification: data.qualification || "",
                languages: data.languages || "",
                job_category: data.job_category || "",
                experience: data.experience || "",
                current_salary: data.current_salary || "",
                expected_salary: data.expected_salary || "",
                age: data.age || "",
                country: data.country || "",
                city: data.city || "",
                postcode: data.postcode || "",
                full_address: data.full_address || "",
                description: data.description || "",
                profile_image: null,   // ✅ ADDED

            };

            setFormData(updatedData);

            // ✅ cache it locally
            localStorage.setItem("candidate_basic_info", JSON.stringify(updatedData));
        }
    } catch (err) {
        console.error("Fetch error:", err);
    }
};


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("Please login again");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/candidate-profile/update-basic-info/",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert("Save failed ❌");
                return;
            }

            alert("Profile saved ✅");
            fetchSavedProfile();

        } catch (err) {
            alert("Network error ❌");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="panel panel-default">
                    <div className="panel-heading wt-panel-heading p-a20">
                        <h4 className="panel-tittle m-a0">Basic Informations</h4>
                    </div>

                    <div className="panel-body wt-panel-body p-a20 m-b30 ">
                        <div className="row">
                              {/* ✅ PROFILE IMAGE FIELD (ADDED ONLY) */}
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Profile Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>


                            {/* Your Name */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="full_name" 
                                            type="text" 
                                            placeholder="Devid Smith" 
                                            value={formData.full_name}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-user " />
                                    </div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="phone" 
                                            type="text" 
                                            placeholder="(251) 1234-456-7890" 
                                            value={formData.phone}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-phone-alt" />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="email" 
                                            type="email" 
                                            placeholder="Devid@example.com" 
                                            value={formData.email}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fas fa-at" />
                                    </div>
                                </div>
                            </div>

                            {/* Website */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Website</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="website" 
                                            type="text" 
                                            placeholder="https://devsmith.net" 
                                            value={formData.website}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-globe-americas" />
                                    </div>
                                </div>
                            </div>

                            {/* Qualification */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Qualification</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="qualification" 
                                            type="text" 
                                            placeholder="BTech" 
                                            value={formData.qualification}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-user-graduate" />
                                    </div>
                                </div>
                            </div>

                            {/* Language */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Language</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="languages" 
                                            type="text" 
                                            placeholder="e.x English, Spanish" 
                                            value={formData.languages}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-language" />
                                    </div>
                                </div>
                            </div>

                            {/* Job Category */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Job Category</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="job_category" 
                                            type="text" 
                                            placeholder="IT & Software" 
                                            value={formData.job_category}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-border-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="col-xl-6 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Experience</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="experience" 
                                            type="text" 
                                            placeholder="05 Years" 
                                            value={formData.experience}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-user-edit" />
                                    </div>
                                </div>
                            </div>

                            {/* Current Salary */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Current Salary</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="current_salary" 
                                            type="text" 
                                            placeholder="65K" 
                                            value={formData.current_salary}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-dollar-sign" />
                                    </div>
                                </div>
                            </div>

                            {/* Expected Salary */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Expected Salary</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="expected_salary" 
                                            type="text" 
                                            placeholder="75K" 
                                            value={formData.expected_salary}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-dollar-sign" />
                                    </div>
                                </div>
                            </div>

                            {/* Age */}
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Age</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="age" 
                                            type="text" 
                                            placeholder="35 Years" 
                                            value={formData.age}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-child" />
                                    </div>
                                </div>
                            </div>

                            {/* Country */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>Country</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="country" 
                                            type="text" 
                                            placeholder="USA" 
                                            value={formData.country}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-globe-americas" />
                                    </div>
                                </div>
                            </div>

                            {/* City */}
                            <div className="col-xl-4 col-lg-6 col-md-12">
                                <div className="form-group">
                                    <label>City</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="city" 
                                            type="text" 
                                            placeholder="Texas" 
                                            value={formData.city}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fa fa-globe-americas" />
                                    </div>
                                </div>
                            </div>

                            {/* Postcode */}
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Postcode</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="postcode" 
                                            type="text" 
                                            placeholder="75462" 
                                            value={formData.postcode}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fas fa-map-pin" />
                                    </div>
                                </div>
                            </div>

                            {/* Full Address */}
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Full Address</label>
                                    <div className="ls-inputicon-box">
                                        <input 
                                            className="form-control" 
                                            name="full_address" 
                                            type="text" 
                                            placeholder="1363-1385 Sunset Blvd Angeles, CA 90026 ,USA" 
                                            value={formData.full_address}
                                            onChange={handleChange} 
                                        />
                                        <i className="fs-input-icon fas fa-map-marker-alt" />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={3} 
                                        name="description" 
                                        value={formData.description}
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button type="submit" className="site-button" disabled={loading}>
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default SectionCandicateBasicInfo;
