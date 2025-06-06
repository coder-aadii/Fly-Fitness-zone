import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import { ENDPOINTS } from '../config';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Prepare login request
            
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            // Get the response data
            const data = await response.json();
            
            // Check if response was successful
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Use the login function from AuthContext
            login(data.token, {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                profileImage: data.user.profileImage
            });

            // Redirect to admin dashboard or news feed based on role
            if (data.user && data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                // Redirect to news feed page directly
                navigate('/feed');
            }
        } catch (err) {
            console.error('Login error:', err);
            
            // Check if the error is "Invalid credentials" and provide a more helpful message
            if (err.message === 'Invalid credentials') {
                setError('Account not found. Please register first or check your credentials.');
            } else {
                setError(err.message || 'An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Login to Your Account</h2>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p className="text-center">{error}</p>
                            {error.includes('register') && (
                                <p className="text-center mt-2">
                                    <Link to="/register" className="text-orange-600 font-medium hover:underline">
                                        Register Now
                                    </Link>
                                </p>
                            )}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <FaEnvelope className="text-orange-500 mr-2" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Password</label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <FaLock className="text-orange-500 mr-2" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full outline-none"
                                    placeholder="Enter password"
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

                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition relative"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="w-5 h-5 mr-2">
                                        <Loader size="small" />
                                    </span>
                                    <span>Logging in...</span>
                                </span>
                            ) : 'Login'}
                        </button>
                    </form>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Don't have an account? <a href="/register" className="text-orange-600 font-medium hover:underline">Register</a>
                    </p>
                </div>
            </section>
        </>
    );
};

export default Login;