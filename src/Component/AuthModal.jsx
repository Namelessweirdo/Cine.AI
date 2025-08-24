import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Handle login
                await handleLogin();
            } else {
                // Handle signup
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                await handleSignup();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        // Simulate login API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, accept any email/password
        if (formData.email && formData.password) {
            localStorage.setItem('user', JSON.stringify({
                email: formData.email,
                username: formData.email.split('@')[0],
                isLoggedIn: true
            }));
            onAuthSuccess();
            onClose();
        } else {
            throw new Error('Please fill in all fields');
        }
    };

    const handleSignup = async () => {
        // Simulate signup API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, accept any valid signup
        if (formData.email && formData.password && formData.username) {
            localStorage.setItem('user', JSON.stringify({
                email: formData.email,
                username: formData.username,
                isLoggedIn: true
            }));
            onAuthSuccess();
            onClose();
        } else {
            throw new Error('Please fill in all fields');
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            username: ''
        });
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-600/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🎬</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back!' : 'Join MovieDiscover'}
                    </h2>
                    <p className="text-gray-300">
                        {isLogin 
                            ? 'Sign in to access your personalized movie experience' 
                            : 'Create an account to start discovering amazing movies'
                        }
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600/20 rounded-lg text-white placeholder-gray-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                placeholder="Enter your username"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600/20 rounded-lg text-white placeholder-gray-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600/20 rounded-lg text-white placeholder-gray-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600/20 rounded-lg text-white placeholder-gray-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                placeholder="Confirm your password"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-semibold py-3 px-6 rounded-lg hover:from-[#C5B3FF] hover:to-[#9A7AFF] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                                {isLogin ? 'Signing In...' : 'Creating Account...'}
                            </div>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Toggle Mode */}
                <div className="text-center mt-6">
                    <p className="text-gray-300">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={toggleMode}
                            className="text-blue-100 hover:text-white font-medium ml-1 transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Features Preview */}
                <div className="mt-8 pt-6 border-t border-gray-600/20">
                    <h3 className="text-white font-semibold mb-3 text-center">Unlock These Features:</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span>
                            Personal Watchlist
                        </div>
                        <div className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span>
                            Search History
                        </div>
                        <div className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span>
                            Movie Ratings
                        </div>
                        <div className="flex items-center text-gray-300">
                            <span className="text-green-400 mr-2">✓</span>
                            Smart Recommendations
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal; 