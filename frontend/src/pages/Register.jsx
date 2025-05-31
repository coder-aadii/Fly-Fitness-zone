import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ENDPOINTS } from '../config';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Registration failed');
            }

            // Registration successful, now show OTP input
            setSuccessMsg('Registration successful! Please check your email for OTP.');
            setShowOtpInput(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const response = await fetch(ENDPOINTS.VERIFY_OTP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, otp }),
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
        }
    };

    return (
        <>
            <Header />
            <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                        Create an Account
                    </h2>

                    {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
                    {successMsg && <p className="text-green-600 mb-4 text-center">{successMsg}</p>}

                    {!showOtpInput && (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Full Name</label>
                                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                    <FaUser className="text-orange-500 mr-2" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full outline-none"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

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
                                        placeholder="Create password"
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

                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                            >
                                Register
                            </button>
                        </form>
                    )}

                    {showOtpInput && (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                    placeholder="6-digit OTP"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                            >
                                Verify OTP
                            </button>
                        </form>
                    )}

                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Already have an account?{' '}
                        <a href="/login" className="text-orange-600 font-medium hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </section>
        </>
    );
};

export default Register;