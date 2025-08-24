import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard.jsx';

const TrendingMovies = ({ onTrailerClick }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('trending');

    const API_BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    const API_OPTIONS = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };

    const tabs = [
        { id: 'trending', label: '🔥 Trending This Week', endpoint: '/trending/movie/week' },
        { id: 'topRated', label: '⭐ Top Rated', endpoint: '/movie/top_rated' },
        { id: 'upcoming', label: '🎬 Coming Soon', endpoint: '/movie/upcoming' },
        { id: 'nowPlaying', label: '🎭 In Theaters', endpoint: '/movie/now_playing' }
    ];

    const fetchMovies = async (endpoint) => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}${endpoint}`,
                API_OPTIONS
            );
            
            if (response.ok) {
                const data = await response.json();
                setMovies(data.results.slice(0, 8));
            } else {
                console.error('Error fetching movies:', response.status);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch initial trending movies
        fetchMovies('/trending/movie/week');
    }, []);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            fetchMovies(tab.endpoint);
        }
    };

    if (loading) {
        return (
            <section className="trending-section mt-12">
                <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-100 mx-auto mb-4"></div>
                        <p className="text-light-200">Loading {tabs.find(t => t.id === activeTab)?.label}...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="trending-section mt-12" data-tab={activeTab}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Discover Amazing Movies</h2>
                
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`tab-button px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? "active bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary"
                                    : "bg-dark-100 text-white hover:bg-light-100/10"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Movies Grid */}
            <div className="trending-movies">
                <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {movies.map((movie, index) => (
                        <div key={movie.id} className="relative group movie-card">
                            <MovieCard 
                                movie={movie} 
                                viewMode="grid" 
                                onTrailerClick={onTrailerClick}
                            />
                            
                            {/* Special badges based on active tab */}
                            {activeTab === 'trending' && index < 3 && (
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg badge">
                                    #{index + 1} Trending
                                </div>
                            )}
                            
                            {activeTab === 'topRated' && movie.vote_average >= 8 && (
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg badge">
                                    ⭐ {movie.vote_average.toFixed(1)}
                                </div>
                            )}
                            
                            {activeTab === 'upcoming' && (
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg badge">
                                    🎬 Coming Soon
                                </div>
                            )}
                            
                            {activeTab === 'nowPlaying' && (
                                <div className="absolute -top-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg badge">
                                    🎭 In Theaters
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-4 border border-light-100/10">
                    <div className="text-2xl font-bold text-white">
                        {movies.length}+
                    </div>
                    <div className="text-light-200 text-sm">
                        {activeTab === 'trending' && 'Trending Movies'}
                        {activeTab === 'topRated' && 'Top Rated Movies'}
                        {activeTab === 'upcoming' && 'Upcoming Movies'}
                        {activeTab === 'nowPlaying' && 'In Theaters'}
                    </div>
                </div>
                
                <div className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-4 border border-light-100/10">
                    <div className="text-2xl font-bold text-white">
                        {activeTab === 'topRated' 
                            ? movies.filter(m => m.vote_average >= 8).length
                            : movies.filter(m => m.vote_average >= 7).length
                        }
                    </div>
                    <div className="text-light-200 text-sm">
                        {activeTab === 'topRated' ? '8+ Rated' : 'Highly Rated'}
                    </div>
                </div>
                
                <div className="bg-dark-100/50 backdrop-blur-sm rounded-xl p-4 border border-light-100/10">
                    <div className="text-2xl font-bold text-white">
                        {activeTab === 'upcoming' 
                            ? movies.filter(m => new Date(m.release_date) > new Date()).length
                            : activeTab === 'nowPlaying'
                            ? movies.filter(m => new Date(m.release_date) <= new Date()).length
                            : new Date().getFullYear()
                        }
                    </div>
                    <div className="text-light-200 text-sm">
                        {activeTab === 'upcoming' && 'Coming Soon'}
                        {activeTab === 'nowPlaying' && 'Currently Showing'}
                        {(activeTab === 'trending' || activeTab === 'topRated') && 'Latest Releases'}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrendingMovies; 