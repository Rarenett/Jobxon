import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { canRoute, candidate, empRoute, employer } from "../../../globals/route-names";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = "http://localhost:8000/api";  // ← FIXED: Changed from /api to /api/auth


function SignUpPopup() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Candidate state
    const [canUsername, setCanUsername] = useState('');
    const [canEmail, setCanEmail] = useState('');
    const [canPassword, setCanPassword] = useState('');
    const [canPhone, setCanPhone] = useState('');
    const [canAgree, setCanAgree] = useState(false);
    const [canError, setCanError] = useState('');
    
    // Employer state
    const [empUsername, setEmpUsername] = useState('');
    const [empEmail, setEmpEmail] = useState('');
    const [empPassword, setEmpPassword] = useState('');
    const [empPhone, setEmpPhone] = useState('');
    const [empAgree, setEmpAgree] = useState(false);
    const [empError, setEmpError] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('candidate');

    // Handle Candidate Registration
    const handleCandidateSignup = async (event) => {
        event.preventDefault();
        setCanError('');

        if (!canAgree) {
            setCanError('Please agree to Terms and Conditions');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/register/`, {
                username: canUsername,
                email: canEmail,
                password: canPassword,
                phone: canPhone,
                name: canUsername,  // Use username as name
                user_type: 'candidate'
            });

            login(response.data.access, response.data.refresh, response.data.user);
            document.getElementById('sign_up_popup').querySelector('.btn-close').click();
            navigate(canRoute(candidate.DASHBOARD));
        } catch (error) {
            if (error.response && error.response.data) {
                const errors = error.response.data;
                if (errors.username) {
                    setCanError(errors.username[0]);
                } else if (errors.email) {
                    setCanError(errors.email[0]);
                } else {
                    setCanError('Registration failed. Please try again.');
                }
            } else {
                setCanError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Employer Registration
    const handleEmployerSignup = async (event) => {
        event.preventDefault();
        setEmpError('');

        if (!empAgree) {
            setEmpError('Please agree to Terms and Conditions');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/register/`, {
                username: empUsername,
                email: empEmail,
                password: empPassword,
                phone: empPhone,
                name: empUsername,  // Use username as name
                user_type: 'employer'
            });

            login(response.data.access, response.data.refresh, response.data.user);
            document.getElementById('sign_up_popup').querySelector('.btn-close').click();
            navigate(empRoute(employer.DASHBOARD));
        } catch (error) {
            if (error.response && error.response.data) {
                const errors = error.response.data;
                if (errors.username) {
                    setEmpError(errors.username[0]);
                } else if (errors.email) {
                    setEmpError(errors.email[0]);
                } else {
                    setEmpError('Registration failed. Please try again.');
                }
            } else {
                setEmpError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Signup
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            
            const response = await axios.post(`${API_URL}/google-login/`, {
                credential: credentialResponse.credential
            });

            const userType = response.data.user.user_type;
            
            if (activeTab === 'candidate' && userType === 'candidate') {
                login(response.data.access, response.data.refresh, response.data.user);
                document.getElementById('sign_up_popup').querySelector('.btn-close').click();
                navigate(canRoute(candidate.DASHBOARD));
            } else if (activeTab === 'employer' && userType === 'employer') {
                login(response.data.access, response.data.refresh, response.data.user);
                document.getElementById('sign_up_popup').querySelector('.btn-close').click();
                navigate(empRoute(employer.DASHBOARD));
            } else {
                if (activeTab === 'candidate') {
                    setCanError('This Google account is not registered as a candidate');
                } else {
                    setEmpError('This Google account is not registered as an employer');
                }
            }
        } catch (error) {
            console.error('Google signup error:', error);
            if (activeTab === 'candidate') {
                setCanError('Google signup failed. Please try again.');
            } else {
                setEmpError('Google signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        if (activeTab === 'candidate') {
            setCanError('Google signup failed');
        } else {
            setEmpError('Google signup failed');
        }
    };

    return (
        <>
            <div className="modal fade twm-sign-up" id="sign_up_popup" aria-hidden="true" aria-labelledby="sign_up_popupLabel" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title" id="sign_up_popupLabel">Sign Up</h2>
                            <p>Sign Up and get access to all the features of Jobzilla</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="twm-tabs-style-2">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className="nav-link active" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#sign-candidate" 
                                            type="button"
                                            onClick={() => setActiveTab('candidate')}
                                        >
                                            <i className="fas fa-user-tie" />Candidate
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className="nav-link" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#sign-Employer" 
                                            type="button"
                                            onClick={() => setActiveTab('employer')}
                                        >
                                            <i className="fas fa-building" />Employer
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                    {/*Signup Candidate Content*/}
                                    <div className="tab-pane fade show active" id="sign-candidate">
                                        <form onSubmit={handleCandidateSignup}>
                                            <div className="row">
                                                {canError && (
                                                    <div className="col-lg-12">
                                                        <div className="alert alert-danger" role="alert">
                                                            {canError}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="username" 
                                                            type="text" 
                                                            required 
                                                            className="form-control" 
                                                            placeholder="Username*"
                                                            value={canUsername}
                                                            onChange={(e) => setCanUsername(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="email" 
                                                            type="email" 
                                                            className="form-control" 
                                                            required 
                                                            placeholder="Email*"
                                                            value={canEmail}
                                                            onChange={(e) => setCanEmail(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="password" 
                                                            type="password" 
                                                            className="form-control" 
                                                            required 
                                                            placeholder="Password*"
                                                            value={canPassword}
                                                            onChange={(e) => setCanPassword(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="phone" 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Phone (Optional)"
                                                            value={canPhone}
                                                            onChange={(e) => setCanPhone(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <div className="form-check">
                                                            <input 
                                                                type="checkbox" 
                                                                className="form-check-input" 
                                                                id="agree1"
                                                                checked={canAgree}
                                                                onChange={(e) => setCanAgree(e.target.checked)}
                                                            />
                                                            <label className="form-check-label" htmlFor="agree1">
                                                                I agree to the <a href="#">Terms and conditions</a>
                                                            </label>
                                                            <p>Already registered?
                                                                <button 
                                                                    type="button"
                                                                    className="twm-backto-login" 
                                                                    data-bs-target="#sign_up_popup2" 
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-dismiss="modal"
                                                                >
                                                                    Log in here
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button type="submit" className="site-button" disabled={loading}>
                                                        {loading ? 'Signing up...' : 'Sign Up'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {/*Signup Employer Content*/}
                                    <div className="tab-pane fade" id="sign-Employer">
                                        <form onSubmit={handleEmployerSignup}>
                                            <div className="row">
                                                {empError && (
                                                    <div className="col-lg-12">
                                                        <div className="alert alert-danger" role="alert">
                                                            {empError}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="username" 
                                                            type="text" 
                                                            required 
                                                            className="form-control" 
                                                            placeholder="Username*"
                                                            value={empUsername}
                                                            onChange={(e) => setEmpUsername(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="email" 
                                                            type="email" 
                                                            className="form-control" 
                                                            required 
                                                            placeholder="Email*"
                                                            value={empEmail}
                                                            onChange={(e) => setEmpEmail(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="password" 
                                                            type="password" 
                                                            className="form-control" 
                                                            required 
                                                            placeholder="Password*"
                                                            value={empPassword}
                                                            onChange={(e) => setEmpPassword(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <input 
                                                            name="phone" 
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="Phone (Optional)"
                                                            value={empPhone}
                                                            onChange={(e) => setEmpPhone(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group mb-3">
                                                        <div className="form-check">
                                                            <input 
                                                                type="checkbox" 
                                                                className="form-check-input" 
                                                                id="agree2"
                                                                checked={empAgree}
                                                                onChange={(e) => setEmpAgree(e.target.checked)}
                                                            />
                                                            <label className="form-check-label" htmlFor="agree2">
                                                                I agree to the <a href="#">Terms and conditions</a>
                                                            </label>
                                                            <p>Already registered?
                                                                <button 
                                                                    type="button"
                                                                    className="twm-backto-login" 
                                                                    data-bs-target="#sign_up_popup2" 
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-dismiss="modal"
                                                                >
                                                                    Log in here
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <button type="submit" className="site-button" disabled={loading}>
                                                        {loading ? 'Signing up...' : 'Sign Up'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <span className="modal-f-title">Login or Sign up with</span>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="outline"
                                    size="large"
                                    text="signup_with"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUpPopup;
