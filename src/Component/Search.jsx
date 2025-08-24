import React, { useState, useEffect } from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Sync local input value with parent search term
    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        setSearchTerm(value);
        
        // Show typing indicator
        setIsTyping(true);
        
        // Hide typing indicator after 500ms (debounce delay)
        setTimeout(() => {
            setIsTyping(false);
        }, 500);
    };

    const handleClearSearch = () => {
        setInputValue('');
        setSearchTerm('');
        setIsTyping(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // Search submitted
        }
    };

    return (
        <div className={`search ${isFocused ? 'search-focused' : ''}`}>
            <div className="search-container">
                <img src="/searcher.png" alt="search" className="search-icon" />
                <input
                    type="text"
                    placeholder="Search through thousands of movies..."
                    value={inputValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="search-input"
                    autoComplete="off"
                />
                
                {/* Typing indicator */}
                {isTyping && inputValue && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    </div>
                )}
                
                {inputValue && (
                    <button
                        onClick={handleClearSearch}
                        className="search-clear-btn"
                        type="button"
                        aria-label="Clear search"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Search;
