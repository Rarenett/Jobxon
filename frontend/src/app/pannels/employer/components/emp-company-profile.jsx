import { useEffect, useState } from "react";
import JobZImage from "../../../common/jobz-img";
import { loadScript } from "../../../../globals/constants";
import { DropzoneComponent } from "react-dropzone-component";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";

const API_URL = "http://localhost:8000/api";
const IMG_BASE_URL = "http://localhost:8000";

const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'images/jobs-company/pic1.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${IMG_BASE_URL}${imageUrl}`;
    return `${IMG_BASE_URL}/${imageUrl}`;
};

function EmpCompanyProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Basic Info State (Added location)
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        phone: '',
        website: '',
        established_since: '',
        team_size: '',
        location: '',  // NEW FIELD
        description: ''
    });

    // Social Links State
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        whatsapp: '',
        instagram: '',
        pinterest: '',
        tumblr: '',
        youtube: ''
    });

    // Video Links State
    const [youtubeLinks, setYoutubeLinks] = useState(['']);
    const [vimeoLinks, setVimeoLinks] = useState(['']);

    // File States
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [photoFiles, setPhotoFiles] = useState([]);

    // Loading States
    const [savingBasicInfo, setSavingBasicInfo] = useState(false);
    const [savingLogo, setSavingLogo] = useState(false);
    const [savingBanner, setSavingBanner] = useState(false);
    const [savingPhotos, setSavingPhotos] = useState(false);
    const [savingSocial, setSavingSocial] = useState(false);
    const [savingVideos, setSavingVideos] = useState(false);

    // Messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Image Viewer State
    const [viewImage, setViewImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        loadScript("js/custom.js");
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/profile/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const profileData = response.data.profile;
            setProfile(profileData);

            // Set Basic Info
            setBasicInfo({
                name: profileData.name || '',
                phone: profileData.phone || '',
                website: profileData.website || '',
                established_since: profileData.established_since || '',
                team_size: profileData.team_size || '',
                location: profileData.location || '',  // NEW FIELD
                description: profileData.description || ''
            });

            // Set Social Links
            setSocialLinks({
                facebook: profileData.facebook || '',
                twitter: profileData.twitter || '',
                linkedin: profileData.linkedin || '',
                whatsapp: profileData.whatsapp || '',
                instagram: profileData.instagram || '',
                pinterest: profileData.pinterest || '',
                tumblr: profileData.tumblr || '',
                youtube: profileData.youtube || ''
            });

            // Set Video Links
            if (profileData.youtube_links && profileData.youtube_links.length > 0) {
                setYoutubeLinks(profileData.youtube_links);
            }
            if (profileData.vimeo_links && profileData.vimeo_links.length > 0) {
                setVimeoLinks(profileData.vimeo_links);
            }

        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
            alert('❌ ERROR: Failed to load profile data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    // Handle viewing image
    const handleViewImage = (imageUrl) => {
        setViewImage(imageUrl);
        setShowImageModal(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setShowImageModal(false);
        setViewImage(null);
    };

    // Handle delete photo
    const handleDeletePhoto = async (photoId) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) {
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`${API_URL}/photos/${photoId}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('✅ Photo deleted successfully!');
            fetchProfile();
        } catch (error) {
            alert('❌ Failed to delete photo');
            console.error(error);
        }
    };

    // ... (Keep all your existing handler functions: handleBasicInfoChange, handleSocialChange, etc.)
    // Handle Basic Info Change
    const handleBasicInfoChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    };

    // Handle Social Links Change
    const handleSocialChange = (e) => {
        setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
    };

    // Handle Youtube Links
    const addYoutubeField = () => {
        setYoutubeLinks([...youtubeLinks, '']);
    };

    const handleYoutubeChange = (index, value) => {
        const newLinks = [...youtubeLinks];
        newLinks[index] = value;
        setYoutubeLinks(newLinks);
    };

    const removeYoutubeField = (index) => {
        setYoutubeLinks(youtubeLinks.filter((_, i) => i !== index));
    };

    // Handle Vimeo Links
    const addVimeoField = () => {
        setVimeoLinks([...vimeoLinks, '']);
    };

    const handleVimeoChange = (index, value) => {
        const newLinks = [...vimeoLinks];
        newLinks[index] = value;
        setVimeoLinks(newLinks);
    };

    const removeVimeoField = (index) => {
        setVimeoLinks(vimeoLinks.filter((_, i) => i !== index));
    };

    // Save Basic Information (Updated to include location)
    const handleSaveBasicInfo = async (e) => {
        e.preventDefault();
        setSavingBasicInfo(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.put(
                `${API_URL}/profiles/update-basic-info/`,
                basicInfo,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('✅ Basic information updated successfully!');
            alert('✅ SUCCESS: Basic information has been updated successfully!');
            fetchProfile();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to update basic information';
            setError(`❌ ${errorMsg}`);
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSavingBasicInfo(false);
        }
    };

    // ... (Keep all other save handlers: handleSaveLogo, handleSaveBanner, handleSavePhotos, handleSaveSocial, handleSaveVideos)
    // Save Logo
    const handleSaveLogo = async (e) => {
        e.preventDefault();
        if (!logoFile) {
            alert('⚠️ WARNING: Please select a logo file first.');
            return;
        }

        setSavingLogo(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('logo', logoFile);

            await axios.put(
                `${API_URL}/profiles/update-logo/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setMessage('✅ Logo updated successfully!');
            alert('✅ SUCCESS: Company logo has been uploaded successfully!');
            setLogoFile(null);
            fetchProfile();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to update logo';
            setError(`❌ ${errorMsg}`);
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSavingLogo(false);
        }
    };

    // Save Banner
    const handleSaveBanner = async (e) => {
        e.preventDefault();
        if (!bannerFile) {
            alert('⚠️ WARNING: Please select a banner image first.');
            return;
        }

        setSavingBanner(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('banner_image', bannerFile);

            await axios.put(
                `${API_URL}/profiles/update-banner/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setMessage('✅ Banner updated successfully!');
            alert('✅ SUCCESS: Banner image has been uploaded successfully!');
            setBannerFile(null);
            fetchProfile();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to update banner';
            setError(`❌ ${errorMsg}`);
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSavingBanner(false);
        }
    };

    // Save Photos
    const handleSavePhotos = async (e) => {
        e.preventDefault();
        if (photoFiles.length === 0) {
            alert('⚠️ WARNING: Please select at least one photo to upload.');
            return;
        }

        setSavingPhotos(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('access_token');

            let uploadedCount = 0;
            for (const file of photoFiles) {
                const formData = new FormData();
                formData.append('image', file);

                await axios.post(
                    `${API_URL}/photos/`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                uploadedCount++;
            }

            setMessage(`✅ ${uploadedCount} photo(s) uploaded successfully!`);
            alert(`✅ SUCCESS: ${uploadedCount} photo(s) have been uploaded to your gallery!`);
            setPhotoFiles([]);
            fetchProfile();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to upload photos';
            setError(`❌ ${errorMsg}`);
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSavingPhotos(false);
        }
    };

    // Save Social Links
    const handleSaveSocial = async (e) => {
        e.preventDefault();
        setSavingSocial(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            await axios.put(
                `${API_URL}/profiles/update-social-links/`,
                socialLinks,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage('✅ Social links updated successfully!');
            alert('✅ SUCCESS: Social media links have been updated successfully!');
            fetchProfile();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to update social links';
            setError(`❌ ${errorMsg}`);
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSavingSocial(false);
        }
    };

    // Save Video Links
    const handleSaveVideos = async (e) => {
        e.preventDefault();
        setSavingVideos(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const filteredYoutube = youtubeLinks.filter(link => link.trim() !== '');
            const filteredVimeo = vimeoLinks.filter(link => link.trim() !== '');

            await axios.put(
                `${API_URL}/profiles/update-video-links/`,
                {
                    youtube_links: filteredYoutube,
                    vimeo_links: filteredVimeo
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            const totalLinks = filteredYoutube.length + filteredVimeo.length;
            setMessage(`✅ ${totalLinks} video link(s) updated successfully!`);
            alert(`✅ SUCCESS: ${totalLinks} video link(s) have been updated!\n\nYouTube: ${filteredYoutube.length}\nVimeo: ${filteredVimeo.length}`);
            fetchProfile();
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to update video links';
            setError(`❌ ${errorMsg}`);
            alert(`❌ ERROR: ${errorMsg}`);
            console.error(error);
        } finally {
            setSavingVideos(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading profile data...</p>
            </div>
        );
    }

    return (
        <>
            {/* Image Viewer Modal */}
            {showImageModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={handleCloseModal}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h5 className="modal-title">Image Preview</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={getImageUrl(viewImage)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="wt-admin-right-page-header clearfix">
                <h2>Company Profile!</h2>
                <div className="breadcrumbs"><a href="#">Home</a><a href="#">Dashboard</a><span>Company Profile!</span></div>
            </div>

            {/* Success/Error Messages */}
            {message && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Success!</strong> {message}
                    <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {/*Logo and Cover image*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Logo and Cover image</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 p-b0 m-b30 ">
                    <div className="row">
                        {/* Logo Section */}
                        <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                                <div className="dashboard-profile-pic">
                                    <div className="dashboard-profile-photo">
                                        <img src={getImageUrl(profile?.logo)} alt="Company Logo" />
                                        <div className="upload-btn-wrapper">
                                            <button className="site-button button-sm">Upload Photo</button>
                                            <input
                                                type="file"
                                                accept=".jpg, .jpeg, .png"
                                                onChange={(e) => setLogoFile(e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                    <p><b>Company Logo :- </b> Max file size is 1MB, Minimum dimension: 136 x 136 And Suitable files are .jpg &amp; .png</p>
                                </div>
                                {logoFile && (
                                    <div className="mt-3">
                                        <p className="text-muted">Selected: {logoFile.name}</p>
                                        <button
                                            onClick={handleSaveLogo}
                                            className="site-button"
                                            disabled={savingLogo}
                                        >
                                            {savingLogo ? 'Uploading...' : 'Save Logo'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Banner Section with Preview */}
                        <div className="col-lg-12 col-md-12">
                            <div className="dashboard-cover-pic">
                                {profile?.banner_image && (
                                    <div className="mb-3 position-relative">
                                        <img
                                            src={getImageUrl(profile.banner_image)}
                                            alt="Current Banner"
                                            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                        <button
                                            className="btn btn-sm btn-info position-absolute top-0 end-0 m-2"
                                            onClick={() => handleViewImage(profile.banner_image)}
                                            style={{ zIndex: 10 }}
                                        >
                                            <i className="fa fa-eye"></i> View Full
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    className="form-control mb-3"
                                    onChange={(e) => setBannerFile(e.target.files[0])}
                                />
                                <p><b>Background Banner Image :- </b> Max file size is 1MB, Minimum dimension: 770 x 310 And Suitable files are .jpg &amp; .png</p>
                                {bannerFile && (
                                    <div className="mt-3">
                                        <p className="text-muted">Selected: {bannerFile.name}</p>
                                        <button
                                            onClick={handleSaveBanner}
                                            className="site-button"
                                            disabled={savingBanner}
                                        >
                                            {savingBanner ? 'Uploading...' : 'Save Banner'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Basic Information with Location Field*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Basic Informations</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30 ">
                    <form onSubmit={handleSaveBasicInfo}>
                        <div className="row">
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            name="name"
                                            type="text"
                                            placeholder="Company Name"
                                            value={basicInfo.name}
                                            onChange={handleBasicInfoChange}
                                        />
                                        <i className="fs-input-icon fa fa-user " />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Phone</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            name="phone"
                                            type="text"
                                            placeholder="(251) 1234-456-7890"
                                            value={basicInfo.phone}
                                            onChange={handleBasicInfoChange}
                                        />
                                        <i className="fs-input-icon fa fa-phone-alt" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            type="email"
                                            placeholder="Email"
                                            value={user?.email || ''}
                                            disabled
                                        />
                                        <i className="fs-input-icon fa fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Website</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            name="website"
                                            type="text"
                                            placeholder="https://..."
                                            value={basicInfo.website}
                                            onChange={handleBasicInfoChange}
                                        />
                                        <i className="fs-input-icon fa fa-globe-americas" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Est. Since</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            name="established_since"
                                            type="text"
                                            placeholder="Since..."
                                            value={basicInfo.established_since}
                                            onChange={handleBasicInfoChange}
                                        />
                                        <i className="fs-input-icon fa fa-calendar" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Team Size</label>
                                    <div className="ls-inputicon-box">
                                        <select
                                            className="form-control"
                                            name="team_size"
                                            value={basicInfo.team_size}
                                            onChange={handleBasicInfoChange}
                                        >
                                            <option value="">Select Size</option>
                                            <option value="5-10">5-10</option>
                                            <option value="10+">10+</option>
                                            <option value="20+">20+</option>
                                            <option value="50+">50+</option>
                                            <option value="100+">100+</option>
                                            <option value="200+">200+</option>
                                            <option value="500+">500+</option>
                                        </select>
                                        <i className="fs-input-icon fa fa-users" />
                                    </div>
                                </div>
                            </div>

                            {/* NEW LOCATION FIELD */}
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control"
                                            name="location"
                                            type="text"
                                            placeholder="City, State, Country"
                                            value={basicInfo.location}
                                            onChange={handleBasicInfoChange}
                                        />
                                        <i className="fs-input-icon fa fa-map-marker-alt" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        name="description"
                                        placeholder="Greetings! We are Galaxy Software Development Company."
                                        value={basicInfo.description}
                                        onChange={handleBasicInfoChange}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button
                                        type="submit"
                                        className="site-button"
                                        disabled={savingBasicInfo}
                                    >
                                        {savingBasicInfo ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        {/*Photo gallery with Preview and Eye Icon*/}
<div className="panel panel-default">
    <div className="panel-heading wt-panel-heading p-a20">
        <h4 className="panel-tittle m-a0">Photo Gallery</h4>
    </div>
    <div className="panel-body wt-panel-body p-a20 m-b30 ">
        {/* Display existing photos */}
        {profile?.photos && profile.photos.length > 0 ? (
            <div className="row mb-4">
                <div className="col-12">
                    <h5 className="mb-3">Current Photos ({profile.photos.length})</h5>
                    <div className="row">
                        {profile.photos.map((photo) => (
                            <div key={photo.id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                                <div className="position-relative" style={{ 
                                    height: '200px', 
                                    overflow: 'hidden', 
                                    borderRadius: '8px', 
                                    border: '2px solid #ddd',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <img 
                                        src={getImageUrl(photo.image)} 
                                        alt={photo.caption || 'Gallery'} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover' 
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'images/jobs-company/pic1.jpg';
                                        }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-2" style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleViewImage(photo.image)}
                                            title="View Image"
                                            style={{ padding: '5px 10px' }}
                                        >
                                            <i className="fa fa-eye"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeletePhoto(photo.id)}
                                            title="Delete Image"
                                            style={{ padding: '5px 10px' }}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                    {photo.caption && (
                                        <div className="position-absolute bottom-0 start-0 end-0 p-2 text-white text-center" 
                                             style={{ 
                                                 backgroundColor: 'rgba(0,0,0,0.7)',
                                                 fontSize: '12px'
                                             }}>
                                            {photo.caption}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="alert alert-info">
                <i className="fa fa-info-circle"></i> No photos uploaded yet. Upload some photos below!
            </div>
        )}

        {/* Upload new photos */}
        <form onSubmit={handleSavePhotos}>
            <div className="row">
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label><strong>Upload New Photos</strong></label>
                        <input 
                            type="file" 
                            accept=".jpg, .jpeg, .png"
                            className="form-control"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setPhotoFiles(files);
                                console.log('Selected files:', files.length);
                            }}
                        />
                        <small className="text-muted mt-2 d-block">
                            Select multiple photos to upload (JPG, JPEG, PNG)
                        </small>
                        {photoFiles.length > 0 && (
                            <div className="alert alert-success mt-2">
                                {photoFiles.length} file(s) selected
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-lg-12 col-md-12">
                    <div className="text-left">
                        <button 
                            type="submit" 
                            className="site-button"
                            disabled={savingPhotos || photoFiles.length === 0}
                        >
                            {savingPhotos ? 'Uploading...' : `Upload  Photo`}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

            {/*Video gallery*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Video Gallery</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30 ">
                    <form onSubmit={handleSaveVideos}>
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Youtube</label>
                                    {youtubeLinks.map((link, index) => (
                                        <div key={index} className="ls-inputicon-box mb-3">
                                            <input
                                                className="form-control wt-form-control"
                                                type="text"
                                                placeholder="https://www.youtube.com/"
                                                value={link}
                                                onChange={(e) => handleYoutubeChange(index, e.target.value)}
                                            />
                                            <i className="fs-input-icon fab fa-youtube" />
                                            {index > 0 && (
                                                <a
                                                    href="#"
                                                    className="remove_field"
                                                    onClick={(e) => { e.preventDefault(); removeYoutubeField(index); }}
                                                >
                                                    <i className="fa fa-times" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                    <div className="text-right m-tb10">
                                        <button
                                            type="button"
                                            className="add_field_youtube"
                                            onClick={addYoutubeField}
                                        >
                                            Add More Fields <i className="fa fa-plus" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="form-group">
                                    <label>Vimeo</label>
                                    {vimeoLinks.map((link, index) => (
                                        <div key={index} className="ls-inputicon-box mb-3">
                                            <input
                                                className="form-control wt-form-control"
                                                type="text"
                                                placeholder="https://vimeo.com/"
                                                value={link}
                                                onChange={(e) => handleVimeoChange(index, e.target.value)}
                                            />
                                            <i className="fs-input-icon fab fa-vimeo-v" />
                                            {index > 0 && (
                                                <a
                                                    href="#"
                                                    className="remove_field"
                                                    onClick={(e) => { e.preventDefault(); removeVimeoField(index); }}
                                                >
                                                    <i className="fa fa-times" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                    <div className="text-right m-tb10">
                                        <button
                                            type="button"
                                            className="add_field_vimeo"
                                            onClick={addVimeoField}
                                        >
                                            Add More Fields <i className="fa fa-plus" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button
                                        type="submit"
                                        className="site-button"
                                        disabled={savingVideos}
                                    >
                                        {savingVideos ? 'Saving...' : 'Save Video Links'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/*Social Network*/}
            <div className="panel panel-default">
                <div className="panel-heading wt-panel-heading p-a20">
                    <h4 className="panel-tittle m-a0">Social Network</h4>
                </div>
                <div className="panel-body wt-panel-body p-a20 m-b30 ">
                    <form onSubmit={handleSaveSocial}>
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Facebook</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="facebook"
                                            type="text"
                                            placeholder="https://www.facebook.com/"
                                            value={socialLinks.facebook}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-facebook-f" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Twitter</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="twitter"
                                            type="text"
                                            placeholder="https://twitter.com/"
                                            value={socialLinks.twitter}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-twitter" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>LinkedIn</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="linkedin"
                                            type="text"
                                            placeholder="https://in.linkedin.com/"
                                            value={socialLinks.linkedin}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-linkedin-in" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Whatsapp</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="whatsapp"
                                            type="text"
                                            placeholder="https://www.whatsapp.com/"
                                            value={socialLinks.whatsapp}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-whatsapp" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Instagram</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="instagram"
                                            type="text"
                                            placeholder="https://www.instagram.com/"
                                            value={socialLinks.instagram}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-instagram" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Pinterest</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="pinterest"
                                            type="text"
                                            placeholder="https://in.pinterest.com/"
                                            value={socialLinks.pinterest}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-pinterest-p" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Tumblr</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="tumblr"
                                            type="text"
                                            placeholder="https://www.tumblr.com/"
                                            value={socialLinks.tumblr}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-tumblr" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="form-group">
                                    <label>Youtube</label>
                                    <div className="ls-inputicon-box">
                                        <input
                                            className="form-control wt-form-control"
                                            name="youtube"
                                            type="text"
                                            placeholder="https://www.youtube.com/"
                                            value={socialLinks.youtube}
                                            onChange={handleSocialChange}
                                        />
                                        <i className="fs-input-icon fab fa-youtube" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <div className="text-left">
                                    <button
                                        type="submit"
                                        className="site-button"
                                        disabled={savingSocial}
                                    >
                                        {savingSocial ? 'Saving...' : 'Save Social Links'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EmpCompanyProfilePage;
