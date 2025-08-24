import React, { useState } from 'react';

const UserProfile = ({ user, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        onLogout();
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            {/* User Avatar Button */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-600/20 rounded-lg px-3 py-2 transition-all duration-200"
            >
                <div className="w-8 h-8 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">
                    {user.username}
                </span>
                <svg 
                    className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-600/20 rounded-xl shadow-2xl z-50">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-600/20">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">{user.username}</h3>
                                <p className="text-gray-300 text-sm">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4 border-b border-gray-600/20">
                        <h4 className="text-white font-medium mb-3">Your Movie Stats</h4>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-100">12</div>
                                <div className="text-gray-300 text-xs">Watchlist</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-100">8</div>
                                <div className="text-gray-300 text-xs">Rated</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-100">24</div>
                                <div className="text-gray-300 text-xs">Searches</div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-2">
                            <span>📋</span>
                            <span>My Watchlist</span>
                        </button>
                        <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-2">
                            <span>⭐</span>
                            <span>My Ratings</span>
                        </button>
                        <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-2">
                            <span>🔍</span>
                            <span>Search History</span>
                        </button>
                        <button className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors flex items-center space-x-2">
                            <span>⚙️</span>
                            <span>Settings</span>
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="p-2 border-t border-gray-600/20">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <span>🚪</span>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
};

export default UserProfile; 