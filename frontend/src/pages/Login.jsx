import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { ENDPOINTS } from '../config';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            
            // Save JWT token in localStorage
            localStorage.setItem('token', data.token);

            // Redirect to user dashboard or admin dashboard based on role
            if (data.user && data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/UserDashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
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
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Login to Your Account</h2>
                    {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
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
                            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
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