import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            // Send password reset request
            const response = await fetch(`${ENDPOINTS.FORGOT_PASSWORD}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link');
            }

            setMessage('Password reset link has been sent to your email');
            setIsSubmitted(true);
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Forgot Password</h2>
                    
                    {!isSubmitted ? (
                        <>
                            <p className="text-gray-600 mb-6 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            
                            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">Email</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                        <FaEnvelope className="text-orange-500 mr-2" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full outline-none"
                                            placeholder="you@example.com"
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
                                            <span>Sending...</span>
                                        </span>
                                    ) : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-green-600 mb-6">{message}</p>
                            <p className="text-gray-600 mb-4">
                                Please check your email and follow the instructions to reset your password.
                            </p>
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-orange-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ForgotPassword;