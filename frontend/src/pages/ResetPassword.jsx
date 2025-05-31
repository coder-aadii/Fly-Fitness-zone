import React, { useState, useEffect } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isReset, setIsReset] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const resetToken = queryParams.get('token');
        
        if (!resetToken) {
            setError('Invalid or missing reset token');
        } else {
            setToken(resetToken);
        }
    }, [location]);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate passwords
        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwords.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            // Send password reset request
            const response = await fetch(`${ENDPOINTS.RESET_PASSWORD}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: passwords.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setMessage('Your password has been reset successfully');
            setIsReset(true);
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && !isReset) {
        return (
            <>
                <Header />
                <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
                    <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Reset Password</h2>
                        <p className="text-red-600 text-center">{error}</p>
                        <div className="mt-6 text-center">
                            <a href="/forgot-password" className="text-orange-600 hover:underline">
                                Request a new password reset link
                            </a>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Header />
            <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Reset Password</h2>
                    
                    {!isReset ? (
                        <>
                            <p className="text-gray-600 mb-6 text-center">
                                Enter your new password below.
                            </p>
                            
                            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">New Password</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                        <FaLock className="text-orange-500 mr-2" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={passwords.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full outline-none"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="ml-2 text-gray-600 hover:text-orange-500"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                        <FaLock className="text-orange-500 mr-2" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full outline-none"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <span className="w-5 h-5 mr-2">
                                                <Loader size="small" />
                                            </span>
                                            <span>Resetting...</span>
                                        </span>
                                    ) : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-green-600 mb-6">{message}</p>
                            <p className="text-gray-600 mb-4">
                                You will be redirected to the login page shortly.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ResetPassword;