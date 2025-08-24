import React, { useState } from 'react'

const MovieCard = ({ movie, viewMode = "grid", onTrailerClick }) => {
    const { title, vote_average, poster_path, release_date, original_language, overview, genre_ids } = movie;
    const [showDetails, setShowDetails] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getRatingColor = (rating) => {
        if (rating >= 8) return 'text-green-400';
        if (rating >= 6) return 'text-yellow-400';
        if (rating >= 4) return 'text-orange-400';
        return 'text-red-400';
    };

    const handleTrailerClick = (e) => {
        e.stopPropagation();
        if (onTrailerClick) {
            onTrailerClick(movie);
        }
    };

    if (viewMode === "list") {
        return (
            <div className="movie-card-list bg-dark-100 p-4 rounded-xl shadow-inner shadow-light-100/10">
                <div className="flex gap-4">
                    <img
                        src={poster_path ?
                            `https://image.tmdb.org/t/p/w200/${poster_path}` : '/No-Movie.png'}
                        alt={title}
                        className="w-24 h-36 rounded-lg object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-white line-clamp-2">{title}</h3>
                            <div className="flex items-center gap-1 ml-2">
                                <img src="/star.svg" alt="Star Icon" className="w-4 h-4" />
                                <span className={`font-bold ${getRatingColor(vote_average)}`}>
                                    {vote_average ? vote_average.toFixed(1) : 'N/A'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
                            <span className="capitalize">{original_language}</span>
                            <span>•</span>
                            <span>{formatDate(release_date)}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                            {overview || "No description available."}
                        </p>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                className="text-light-200 hover:text-white text-sm underline"
                            >
                                {showDetails ? 'Show less' : 'Show more details'}
                            </button>
                            
                            <button
                                onClick={handleTrailerClick}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Watch Trailer
                            </button>
                        </div>
                        
                        {showDetails && (
                            <div className="mt-3 p-3 bg-light-100/5 rounded-lg">
                                <p className="text-gray-300 text-sm">{overview}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Grid view (default)
    return (
        <div className="movie-card group cursor-pointer transition-transform hover:scale-105">
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={poster_path ?
                        `https://image.tmdb.org/t/p/w500/${poster_path}` : '/No-Movie.png'}
                    alt={title}
                    className="w-full h-auto transition-transform group-hover:scale-110"
                />
                
                {/* Overlay with quick info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm line-clamp-3">{overview}</p>
                    </div>
                </div>
                
                {/* Rating badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                    <div className="flex items-center gap-1">
                        <img src="/star.svg" alt="Star Icon" className="w-3 h-3" />
                        <span className={`text-xs font-bold ${getRatingColor(vote_average)}`}>
                            {vote_average ? vote_average.toFixed(1) : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Trailer Play Button */}
                <button
                    onClick={handleTrailerClick}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="mt-4">
                <h3 className="text-white font-bold text-base line-clamp-1 mb-2">{title}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="/star.svg" alt="Star Icon" />
                        <p className={getRatingColor(vote_average)}>
                            {vote_average ? vote_average.toFixed(1) : 'N/A'}
                        </p>
                    </div>

                    <span>•</span>
                    <p className="lang capitalize">{original_language}</p>

                    <span>•</span>
                    <p className="year">{formatDate(release_date)}</p>
                </div>
                
                {/* Quick actions */}
                <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-light-100/10 text-white text-sm py-2 rounded-lg hover:bg-light-100/20 transition-colors">
                        Add to Watchlist
                    </button>
                    <button 
                        onClick={handleTrailerClick}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Trailer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;