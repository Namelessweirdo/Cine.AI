import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Search from './Component/Search.jsx';
import MovieCard from './Component/MovieCard.jsx';
import TrendingMovies from './Component/TrendingMovies.jsx';
import TrailerModal from './Component/TrailerModal.jsx';
import AuthModal from './Component/AuthModal.jsx';
import UserProfile from './Component/UserProfile.jsx';
import { updateSearchCount } from './appwrite.js';

function App() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [movieList, setMovieList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortBy, setSortBy] = useState("popularity.desc");
    const [viewMode, setViewMode] = useState("grid");
    const [trailerModal, setTrailerModal] = useState({ isOpen: false, movie: null });
    
    // Authentication state
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const API_BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    const API_OPTIONS = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };

    // Check if user is logged in on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    // Debounce search input
    useDebounce(
        () => {
            setDebouncedSearch(search);
        },
        500,
        [search]
    );

    useEffect(() => {
        const fetchMovies = async (query = "", genres = [], sort = "popularity.desc") => {
            setLoading(true);
            setErrorMessage("");

            try {
                let endpoint;
                if (query && query.trim() !== "") {
                    endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query.trim())}`;
                } else {
                    const genreParams = genres.length > 0 ? `&with_genres=${genres.join(',')}` : '';
                    endpoint = `${API_BASE_URL}/discover/movie?sort_by=${sort}${genreParams}`;
                }

                const response = await fetch(endpoint, API_OPTIONS);

                if (!response.ok) {
                    throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.results || data.results.length === 0) {
                    setErrorMessage("No movies found. Try adjusting your filters.");
                    setMovieList([]);
                } else {
                    setMovieList(data.results);

                    if (query && query.trim() !== "" && data.results.length > 0) {
                        await updateSearchCount(query.trim(), data.results[0]);
                        
                        // Smooth scroll to search results after a short delay
                        setTimeout(() => {
                            const searchResults = document.querySelector('.search-results');
                            if (searchResults) {
                                searchResults.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start' 
                                });
                            }
                        }, 300);
                    }
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
                setErrorMessage(`Error fetching movies: ${error.message}`);
                setMovieList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies(debouncedSearch, selectedGenres, sortBy);
    }, [debouncedSearch, selectedGenres, sortBy]);

    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedGenres([]);
        setSortBy("popularity.desc");
        setViewMode("grid");
    };

    const handleTrailerClick = (movie) => {
        setTrailerModal({ isOpen: true, movie });
    };

    const closeTrailerModal = () => {
        setTrailerModal({ isOpen: false, movie: null });
    };

    const handleAuthSuccess = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    };

    const handleLogout = () => {
        setUser(null);
    };

    const openAuthModal = () => {
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const GENRES = [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Science Fiction" },
        { id: 10770, name: "TV Movie" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "War" },
        { id: 37, name: "Western" }
    ];

    if (!API_KEY) {
        return (
            <div className="min-h-screen bg-dark-100 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">API Key Missing</h1>
                    <p className="text-light-200">Please add your TMDB API key to the .env file</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-100 text-white">
            {/* Header with Auth */}
            <header className="relative">
                <img src="./BG-1.png" alt="Hero Banner" />
                <img src="./hero-img.png" alt="Hero Banner" />
                
                {/* Auth Button/User Profile */}
                <div className="absolute top-4 right-4 z-10">
                    {user ? (
                        <UserProfile user={user} onLogout={handleLogout} />
                    ) : (
                        <button
                            onClick={openAuthModal}
                            className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-semibold px-6 py-2 rounded-lg hover:from-[#C5B3FF] hover:to-[#9A7AFF] transition-all duration-300 transform hover:scale-105"
                        >
                            Sign In
                        </button>
                    )}
                </div>
                
                <h1 className="text-white text-3xl font-bold">
                    Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
                </h1>
                <Search searchTerm={search} setSearchTerm={setSearch} />
                
                {/* Search Results - Now in header for immediate visibility */}
                {search && (
                    <div className="mt-8 search-results">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-light-100 mx-auto mb-4"></div>
                                <p className="text-light-200 text-lg">Searching for movies...</p>
                                <p className="text-light-200/70">"{search}"</p>
                            </div>
                        ) : errorMessage ? (
                            <div className="text-center py-8">
                                <div className="text-red-400 text-6xl mb-4">🔍</div>
                                <p className="text-red-400 text-xl mb-4">{errorMessage}</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-light-100/10 text-white px-6 py-3 rounded-lg hover:bg-light-100/20 transition-colors"
                                >
                                    Reset Search
                                </button>
                            </div>
                        ) : movieList.length > 0 ? (
                            <div className="space-y-6">
                                {/* Search Results Header */}
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-4 bg-gradient-to-r from-light-100/10 to-light-100/5 px-8 py-6 rounded-2xl border border-light-100/20 search-status">
                                        <div className="text-3xl animate-pulse">🎬</div>
                                        <div>
                                            <h3 className="text-white text-xl font-semibold mb-1">Search Results</h3>
                                            <p className="text-light-200">Found {movieList.length} movie{movieList.length !== 1 ? 's' : ''} for "{search}"</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Search Results Grid */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white">Results for "{search}"</h2>
                                        <span className="text-light-200 bg-light-100/10 px-3 py-2 rounded-lg">
                                            {movieList.length} movie{movieList.length !== 1 ? 's' : ''} found
                                        </span>
                                    </div>
                                    
                                    <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {movieList.map((movie, index) => (
                                            <div 
                                                key={movie.id} 
                                                className="animate-fade-in"
                                                style={{ 
                                                    animationDelay: `${index * 100}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                <MovieCard 
                                                    movie={movie} 
                                                    viewMode="grid"
                                                    onTrailerClick={handleTrailerClick}
                                                />
                                            </div>
                                        ))}
                                    </ul>
                                    
                                    {/* Clear Search Button */}
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={clearFilters}
                                            className="bg-light-100/10 text-white px-6 py-3 rounded-lg hover:bg-light-100/20 transition-colors"
                                        >
                                            Clear Search & Show All Movies
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-light-200 text-6xl mb-4">🔍</div>
                                <p className="text-light-200 text-xl mb-4">No movies found for "{search}"</p>
                                <p className="text-light-200/70 mb-4">Try a different search term</p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-light-100/10 text-white px-6 py-3 rounded-lg hover:bg-light-100/20 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Filters Section */}
            <section className="filters px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Genre Filters */}
                        <div className="genre-filters flex flex-wrap gap-2">
                            {GENRES.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => handleGenreToggle(genre.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                        selectedGenres.includes(genre.id)
                                            ? "bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary"
                                            : "bg-dark-200 text-light-200 hover:bg-light-100/10"
                                    }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>

                        {/* Sort and View Controls */}
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-dark-200 text-white px-3 py-2 rounded-lg border border-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/50"
                            >
                                <option value="popularity.desc">Most Popular</option>
                                <option value="vote_average.desc">Highest Rated</option>
                                <option value="release_date.desc">Newest First</option>
                                <option value="release_date.asc">Oldest First</option>
                                <option value="title.asc">A-Z</option>
                                <option value="title.desc">Z-A</option>
                            </select>

                            <div className="flex bg-dark-200 rounded-lg p-1 border border-light-100/20">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === "grid"
                                            ? "bg-light-100/20 text-white"
                                            : "text-light-200 hover:text-white"
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded transition-colors ${
                                        viewMode === "list"
                                            ? "bg-light-100/20 text-white"
                                            : "text-light-200 hover:text-white"
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {selectedGenres.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-light-200 hover:text-white transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* All Movies Section */}
            <section className="all-movies mt-8">
                {!search && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">All Movies</h2>
                            <span className="text-light-200 bg-light-100/10 px-3 py-2 rounded-lg">
                                {movieList.length} movie{movieList.length !== 1 ? 's' : ''} found
                            </span>
                        </div>
                        
                        <ul className={`text-white ${viewMode === "grid" ? "grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "flex flex-col gap-4"}`}>
                            {movieList.map((movie) => (
                                <MovieCard 
                                    key={movie.id} 
                                    movie={movie} 
                                    viewMode={viewMode}
                                    onTrailerClick={handleTrailerClick}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </section>

            {/* Trending Movies Section */}
            <TrendingMovies onTrailerClick={handleTrailerClick} />

            {/* Trailer Modal */}
            <TrailerModal
                isOpen={trailerModal.isOpen}
                movie={trailerModal.movie}
                onClose={closeTrailerModal}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={closeAuthModal}
                onAuthSuccess={handleAuthSuccess}
            />
        </div>
    );
}

export default App;
