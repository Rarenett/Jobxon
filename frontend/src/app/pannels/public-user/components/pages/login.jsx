import { NavLink, useNavigate } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { canRoute, candidate, empRoute, employer, publicUser } from "../../../../../globals/route-names";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = "http://localhost:8000/api";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Candidate state
    const [canEmail, setCanEmail] = useState('');
    const [canPassword, setCanPassword] = useState('');
    const [canError, setCanError] = useState('');
    
    // Employer state
    const [empEmail, setEmpEmail] = useState('');
    const [empPassword, setEmpPassword] = useState('');
    const [empError, setEmpError] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('candidate'); // Track active tab

    // Handle Candidate Login
    const handleCandidateLogin = async (event) => {
        event.preventDefault();
        setCanError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login/`, {
                email: canEmail,
                password: canPassword
            });

            if (response.data.user.user_type === 'candidate') {
                login(response.data.access, response.data.refresh, response.data.user);
                navigate(canRoute(candidate.DASHBOARD));
            } else {
                setCanError('This account is not a candidate account');
            }
        } catch (error) {
            if (error.response) {
                setCanError(error.response.data.message || 'Invalid email or password');
            } else {
                setCanError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Employer Login
    const handleEmployerLogin = async (event) => {
        event.preventDefault();
        setEmpError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login/`, {
                email: empEmail,
                password: empPassword
            });

            if (response.data.user.user_type === 'employer') {
                login(response.data.access, response.data.refresh, response.data.user);
                navigate(empRoute(employer.DASHBOARD));
            } else {
                setEmpError('This account is not an employer account');
            }
        } catch (error) {
            if (error.response) {
                setEmpError(error.response.data.message || 'Invalid email or password');
            } else {
                setEmpError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            
            // Send Google credential to Django backend
            const response = await axios.post(`${API_URL}/google-login/`, {
                credential: credentialResponse.credential
            });

            // Check user type based on active tab
            const userType = response.data.user.user_type;
            
            if (activeTab === 'candidate' && userType === 'candidate') {
                login(response.data.access, response.data.refresh, response.data.user);
                navigate(canRoute(candidate.DASHBOARD));
            } else if (activeTab === 'employer' && userType === 'employer') {
                login(response.data.access, response.data.refresh, response.data.user);
                navigate(empRoute(employer.DASHBOARD));
            } else {
                // User type mismatch
                if (activeTab === 'candidate') {
                    setCanError('This Google account is not registered as a candidate');
                } else {
                    setEmpError('This Google account is not registered as an employer');
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            if (activeTab === 'candidate') {
                setCanError('Google login failed. Please try again.');
            } else {
                setEmpError('Google login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Login Error
    const handleGoogleError = () => {
        if (activeTab === 'candidate') {
            setCanError('Google login failed');
        } else {
            setEmpError('Google login failed');
        }
    };

    return (
        <>
            <div className="section-full site-bg-white">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-8 col-lg-6 col-md-5 twm-log-reg-media-wrap">
                            <div className="twm-log-reg-media">
                                <div className="twm-l-media">
                                    <JobZImage src="images/login-bg.png" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-7">
                            <div className="twm-log-reg-form-wrap">
                                <div className="twm-log-reg-logo-head">
                                    <NavLink to={publicUser.HOME1}>
                                        <JobZImage src="images/logo-dark.png" alt="" className="logo" />
                                    </NavLink>
                                </div>
                                <div className="twm-log-reg-inner">
                                    <div className="twm-log-reg-head">
                                        <div className="twm-log-reg-logo">
                                            <span className="log-reg-form-title">Log In</span>
                                        </div>
                                    </div>
                                    <div className="twm-tabs-style-2">
                                        <ul className="nav nav-tabs" id="myTab2" role="tablist">
                                            {/*Login Candidate*/}
                                            <li className="nav-item">
                                                <button 
                                                    className="nav-link active" 
                                                    data-bs-toggle="tab" 
                                                    data-bs-target="#twm-login-candidate" 
                                                    type="button"
                                                    onClick={() => setActiveTab('candidate')}
                                                >
                                                    <i className="fas fa-user-tie" />Candidate
                                                </button>
                                            </li>
                                            {/*Login Employer*/}
                                            <li className="nav-item">
                                                <button 
                                                    className="nav-link" 
                                                    data-bs-toggle="tab" 
                                                    data-bs-target="#twm-login-Employer" 
                                                    type="button"
                                                    onClick={() => setActiveTab('employer')}
                                                >
                                                    <i className="fas fa-building" />Employer
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTab2Content">
                                            {/*Login Candidate Content*/}
                                            <form onSubmit={handleCandidateLogin} className="tab-pane fade show active" id="twm-login-candidate">
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
                                                                name="email"
                                                                type="email"
                                                                required
                                                                className="form-control"
                                                                placeholder="Email*"
                                                                value={canEmail}
                                                                onChange={(event) => setCanEmail(event.target.value)}
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
                                                                onChange={(event) => setCanPassword(event.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="twm-forgot-wrap">
                                                            <div className="form-group mb-3">
                                                                <div className="form-check">
                                                                    <input type="checkbox" className="form-check-input" id="Password4" />
                                                                    <label className="form-check-label rem-forgot" htmlFor="Password4">
                                                                        Remember me <a href="#" className="site-text-primary">Forgot Password</a>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="site-button" disabled={loading}>
                                                                {loading ? 'Logging in...' : 'Log in'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <span className="center-text-or">Or</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <GoogleLogin
                                                                onSuccess={handleGoogleSuccess}
                                                                onError={handleGoogleError}
                                                                theme="outline"
                                                                size="large"
                                                                text="continue_with"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            {/*Login Employer Content*/}
                                            <form onSubmit={handleEmployerLogin} className="tab-pane fade" id="twm-login-Employer">
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
                                                                name="email"
                                                                type="email"
                                                                required
                                                                className="form-control"
                                                                placeholder="Email*"
                                                                value={empEmail}
                                                                onChange={(event) => setEmpEmail(event.target.value)}
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
                                                                onChange={(event) => setEmpPassword(event.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="twm-forgot-wrap">
                                                            <div className="form-group mb-3">
                                                                <div className="form-check">
                                                                    <input type="checkbox" className="form-check-input" id="Password5" />
                                                                    <label className="form-check-label rem-forgot" htmlFor="Password5">
                                                                        Remember me <a href="#" className="site-text-primary">Forgot Password</a>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <button type="submit" className="site-button" disabled={loading}>
                                                                {loading ? 'Logging in...' : 'Log in'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <span className="center-text-or">Or</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <GoogleLogin
                                                                onSuccess={handleGoogleSuccess}
                                                                onError={handleGoogleError}
                                                                theme="outline"
                                                                size="large"
                                                                text="continue_with"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
