import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { canRoute, candidate, empRoute, employer } from "../../../globals/route-names";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = "http://localhost:8000/api";

function SignInPopup() {
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
    const [activeTab, setActiveTab] = useState('candidate');

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
                document.getElementById('sign_up_popup2').querySelector('.btn-close').click();
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
                document.getElementById('sign_up_popup2').querySelector('.btn-close').click();
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

    // Handle Google Login
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            
            const response = await axios.post(`${API_URL}/google-login/`, {
                credential: credentialResponse.credential
            });

            const userType = response.data.user.user_type;
            
            if (activeTab === 'candidate' && userType === 'candidate') {
                login(response.data.access, response.data.refresh, response.data.user);
                document.getElementById('sign_up_popup2').querySelector('.btn-close').click();
                navigate(canRoute(candidate.DASHBOARD));
            } else if (activeTab === 'employer' && userType === 'employer') {
                login(response.data.access, response.data.refresh, response.data.user);
                document.getElementById('sign_up_popup2').querySelector('.btn-close').click();
                navigate(empRoute(employer.DASHBOARD));
            } else {
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

    const handleGoogleError = () => {
        if (activeTab === 'candidate') {
            setCanError('Google login failed');
        } else {
            setEmpError('Google login failed');
        }
    };

    return (
        <>
            <div className="modal fade twm-sign-up" id="sign_up_popup2" aria-hidden="true" aria-labelledby="sign_up_popupLabel2" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title" id="sign_up_popupLabel2">Login</h2>
                            <p>Login and get access to all the features of Jobzilla</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="twm-tabs-style-2">
                                <ul className="nav nav-tabs" id="myTab2" role="tablist">
                                    {/*Login Candidate*/}
                                    <li className="nav-item">
                                        <button 
                                            className="nav-link active" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#login-candidate" 
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
                                            data-bs-target="#login-Employer" 
                                            type="button"
                                            onClick={() => setActiveTab('employer')}
                                        >
                                            <i className="fas fa-building" />Employer
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTab2Content">
                                    {/*Login Candidate Content*/}
                                    <form onSubmit={handleCandidateLogin} className="tab-pane fade show active" id="login-candidate">
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
                                                <div className="form-group mb-3">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id="Password3" />
                                                        <label className="form-check-label rem-forgot" htmlFor="Password3">
                                                            Remember me <a href="#">Forgot Password</a>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <button type="submit" className="site-button" disabled={loading}>
                                                    {loading ? 'Logging in...' : 'Log in'}
                                                </button>
                                                <div className="mt-3 mb-3">
                                                    Don't have an account ?
                                                    <button 
                                                        type="button"
                                                        className="twm-backto-login" 
                                                        data-bs-target="#sign_up_popup" 
                                                        data-bs-toggle="modal" 
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Sign Up
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {/*Login Employer Content*/}
                                    <form onSubmit={handleEmployerLogin} className="tab-pane fade" id="login-Employer">
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
                                                <div className="form-group mb-3">
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id="Password4" />
                                                        <label className="form-check-label rem-forgot" htmlFor="Password4">
                                                            Remember me <a href="#">Forgot Password</a>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <button type="submit" className="site-button" disabled={loading}>
                                                    {loading ? 'Logging in...' : 'Log in'}
                                                </button>
                                                <div className="mt-3 mb-3">
                                                    Don't have an account ?
                                                    <button 
                                                        type="button"
                                                        className="twm-backto-login" 
                                                        data-bs-target="#sign_up_popup" 
                                                        data-bs-toggle="modal" 
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Sign Up
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
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
                                    text="signin_with"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignInPopup;
