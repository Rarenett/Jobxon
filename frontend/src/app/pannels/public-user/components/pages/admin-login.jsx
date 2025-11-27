import { NavLink, useNavigate } from "react-router-dom";
import JobZImage from "../../../../common/jobz-img";
import { publicUser } from "../../../../../globals/route-names";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

const API_URL = "http://localhost:8000/api";

function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // Admin state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle Admin Login
    const handleAdminLogin = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login/`, {
                email: email,
                password: password
            });

            if (response.data.user.user_type === 'admin') {
                login(response.data.access, response.data.refresh, response.data.user);
                navigate('/admin/dashboard'); // Update with your admin dashboard route
            } else {
                setError('Access denied. Admin credentials required.');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Invalid email or password');
            } else {
                setError('Network error. Please try again.');
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

            // Check if user is admin
            if (response.data.user.user_type === 'admin') {
                login(response.data.access, response.data.refresh, response.data.user);
                navigate('/admin/dashboard'); // Update with your admin dashboard route
            } else {
                setError('Access denied. This Google account is not registered as admin.');
            }
        } catch (error) {
            console.error('Google login error:', error);
            setError('Google login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Login Error
    const handleGoogleError = () => {
        setError('Google login failed');
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
                                            <span className="log-reg-form-title">Admin Login</span>
                                        </div>
                                    </div>
                                    
                                    {/* Single Admin Login Form - No Tabs */}
                                    <form onSubmit={handleAdminLogin}>
                                        <div className="row">
                                            {error && (
                                                <div className="col-lg-12">
                                                    <div className="alert alert-danger" role="alert">
                                                        {error}
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
                                                        placeholder="Admin Email*"
                                                        value={email}
                                                        onChange={(event) => setEmail(event.target.value)}
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
                                                        value={password}
                                                        onChange={(event) => setPassword(event.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="twm-forgot-wrap">
                                                    <div className="form-group mb-3">
                                                        <div className="form-check">
                                                            <input type="checkbox" className="form-check-input" id="RememberMe" />
                                                            <label className="form-check-label rem-forgot" htmlFor="RememberMe">
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
        </>
    );
}

export default AdminLoginPage;
