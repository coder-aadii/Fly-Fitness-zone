import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic
    };

    return (
        <section className="bg-gradient-to-r from-orange-100 via-white to-orange-100 min-h-screen flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create an Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                        Register
                    </button>
                </form>
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account? <a href="/login" className="text-orange-600 font-medium hover:underline">Login</a>
                </p>
            </div>
        </section>
    );
};

export default Register;
