import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaKey, FaCheck } from 'react-icons/fa';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';

const VerifyOTP = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract email from URL query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const emailParam = queryParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        if (!email || !otp) {
            setError('Email and OTP are required');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(ENDPOINTS.VERIFY_OTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'OTP verification failed');
            }

            setSuccessMsg('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle OTP input - only allow numbers and limit to 6 digits
    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 6) {
            setOtp(value);
        }
    };

    return (
        <>
            <Header />
            <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                        Verify Your Email
                    </h2>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    {successMsg && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex items-center">
                            <FaCheck className="mr-2" />
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Email Address</label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <FaEnvelope className="text-orange-500 mr-2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full outline-none"
                                    placeholder="Your registered email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Enter OTP</label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <FaKey className="text-orange-500 mr-2" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    required
                                    className="w-full outline-none"
                                    placeholder="6-digit OTP"
                                    maxLength={6}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the 6-digit code sent to your email
                            </p>
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
                                    <span>Verifying...</span>
                                </span>
                            ) : 'Verify OTP'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive the OTP?{' '}
                            <a href="/register" className="text-orange-600 font-medium hover:underline">
                                Try again
                            </a>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Already verified?{' '}
                            <a href="/login" className="text-orange-600 font-medium hover:underline">
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default VerifyOTP;