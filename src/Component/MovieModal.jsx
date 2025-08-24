import React, { useEffect, useState } from 'react';

const MovieModal = ({ movie, isOpen, onClose }) => {
    const [movieDetails, setMovieDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    const API_OPTIONS = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };

    useEffect(() => {
        if (isOpen && movie) {
            fetchMovieDetails();
        }
    }, [isOpen, movie]);

    const fetchMovieDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/movie/${movie.id}?append_to_response=credits,videos,similar`,
                API_OPTIONS
            );
            
            if (response.ok) {
                const data = await response.json();
                setMovieDetails(data);
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !movie) return null;

    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const formatBudget = (budget) => {
        if (!budget || budget === 0) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 0
        }).format(budget);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    {/* Hero Image */}
                    <div className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden">
                        <img
                            src={movie.backdrop_path 
                                ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                                : movie.poster_path 
                                    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                    : '/No-Movie.png'
                            }
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                        
                        {/* Movie Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {movie.title}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-300">
                                <span>{movie.release_date?.split('-')[0]}</span>
                                <span>•</span>
                                <span>{movie.original_language?.toUpperCase()}</span>
                                {movieDetails?.runtime && (
                                    <>
                                        <span>•</span>
                                        <span>{formatRuntime(movieDetails.runtime)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Poster and Basic Info */}
                            <div className="lg:col-span-1">
                                <img
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                        : '/No-Movie.png'
                                    }
                                    alt={movie.title}
                                    className="w-full rounded-lg shadow-lg"
                                />
                                
                                {/* Quick Actions */}
                                <div className="mt-4 space-y-2">
                                    <button className="w-full bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                        Add to Watchlist
                                    </button>
                                    <button className="w-full bg-blue-100/10 text-white py-3 rounded-lg hover:bg-blue-100/20 transition-colors">
                                        Share Movie
                                    </button>
                                </div>

                                {/* Rating */}
                                <div className="mt-4 p-4 bg-blue-100/5 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <img src="/star.svg" alt="Star" className="w-5 h-5" />
                                        <span className="text-xl font-bold text-white">
                                            {movie.vote_average?.toFixed(1) || 'N/A'}
                                        </span>
                                        <span className="text-gray-300">/ 10</span>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        {movie.vote_count} votes
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Overview */}
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-3">Overview</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {movie.overview || "No overview available."}
                                    </p>
                                </div>

                                {/* Movie Details */}
                                {movieDetails && (
                                    <>
                                        {/* Genres */}
                                        {movieDetails.genres && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {movieDetails.genres.map(genre => (
                                                        <span
                                                            key={genre.id}
                                                            className="px-3 py-1 bg-blue-100/10 text-white text-sm rounded-full"
                                                        >
                                                            {genre.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cast */}
                                        {movieDetails.credits?.cast && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-3">Cast</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {movieDetails.credits.cast.slice(0, 6).map(person => (
                                                        <div key={person.id} className="text-center">
                                                            <img
                                                                src={person.profile_path 
                                                                    ? `https://image.tmdb.org/t/p/w200/${person.profile_path}`
                                                                    : '/No-Movie.png'
                                                                }
                                                                alt={person.name}
                                                                className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                                                            />
                                                            <p className="text-sm text-white font-medium">{person.name}</p>
                                                            <p className="text-xs text-gray-300">{person.character}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-blue-100/5 p-4 rounded-lg">
                                                <h4 className="font-semibold text-white mb-2">Production Details</h4>
                                                <div className="space-y-2 text-sm text-gray-300">
                                                    <div>
                                                        <span className="font-medium">Budget: </span>
                                                        {formatBudget(movieDetails.budget)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Revenue: </span>
                                                        {formatBudget(movieDetails.revenue)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Status: </span>
                                                        {movieDetails.status}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-100/5 p-4 rounded-lg">
                                                <h4 className="font-semibold text-white mb-2">Release Info</h4>
                                                <div className="space-y-2 text-sm text-gray-300">
                                                    <div>
                                                        <span className="font-medium">Release Date: </span>
                                                        {movieDetails.release_date ? new Date(movieDetails.release_date).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Runtime: </span>
                                                        {formatRuntime(movieDetails.runtime)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Language: </span>
                                                        {movieDetails.original_language?.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieModal; 