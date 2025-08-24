import React, { useState, useEffect } from 'react';

const TrailerModal = ({ movie, isOpen, onClose }) => {
    const [trailers, setTrailers] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = "https://api.themoviedb.org/3";
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    const API_OPTIONS = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    };

    useEffect(() => {
        if (isOpen && movie) {
            fetchTrailers();
        }
    }, [isOpen, movie]);

    const fetchTrailers = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // First, try to get trailers from TMDB
            const tmdbResponse = await fetch(
                `${API_BASE_URL}/movie/${movie.id}/videos`,
                API_OPTIONS
            );
            
            let tmdbTrailers = [];
            if (tmdbResponse.ok) {
                const tmdbData = await tmdbResponse.json();
                tmdbTrailers = tmdbData.results
                    .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
                    .map(video => ({
                        id: video.key,
                        title: video.name,
                        site: 'TMDB',
                        thumbnail: `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`
                    }));
            }

            // If we have TMDB trailers, use them
            if (tmdbTrailers.length > 0) {
                setTrailers(tmdbTrailers);
                setSelectedTrailer(tmdbTrailers[0]);
            } else {
                // Fallback: Search YouTube for trailers
                await searchYouTubeTrailers();
            }
        } catch (error) {
            console.error('Error fetching trailers:', error);
            // Fallback to YouTube search
            await searchYouTubeTrailers();
        } finally {
            setLoading(false);
        }
    };

    const searchYouTubeTrailers = async () => {
        if (!YOUTUBE_API_KEY) {
            setError('YouTube API key not configured. Please add VITE_YOUTUBE_API_KEY to your environment variables.');
            return;
        }

        try {
            const searchQuery = `${movie.title} ${movie.release_date?.split('-')[0] || ''} official trailer`;
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=1&maxResults=5&key=${YOUTUBE_API_KEY}`
            );

            if (response.ok) {
                const data = await response.json();
                const youtubeTrailers = data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    site: 'YouTube',
                    thumbnail: item.snippet.thumbnails.high.url
                }));
                
                setTrailers(youtubeTrailers);
                if (youtubeTrailers.length > 0) {
                    setSelectedTrailer(youtubeTrailers[0]);
                }
            } else {
                throw new Error('Failed to fetch YouTube trailers');
            }
        } catch (error) {
            console.error('Error searching YouTube:', error);
            setError('Unable to load trailers. Please try again later.');
        }
    };

    const handleTrailerSelect = (trailer) => {
        setSelectedTrailer(trailer);
    };

    if (!isOpen || !movie) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-100 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative p-6 border-b border-light-100/10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <img
                            src={movie.poster_path 
                                ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
                                : '/No-Movie.png'
                            }
                            alt={movie.title}
                            className="w-20 h-30 rounded-lg object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                {movie.title} - Trailers
                            </h1>
                            <p className="text-light-200">
                                Watch official trailers and previews
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-100"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
                            <button
                                onClick={searchYouTubeTrailers}
                                className="bg-light-100/10 text-white px-6 py-3 rounded-lg hover:bg-light-100/20 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : trailers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-light-200 text-xl mb-4">No trailers found</div>
                            <p className="text-gray-400">Try searching for this movie on YouTube</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Video Player */}
                            <div className="lg:col-span-2">
                                <div className="bg-black rounded-xl overflow-hidden aspect-video">
                                    {selectedTrailer && (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${selectedTrailer.id}?autoplay=1&rel=0&modestbranding=1`}
                                            title={selectedTrailer.title}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                                
                                {selectedTrailer && (
                                    <div className="mt-4">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {selectedTrailer.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-light-200">
                                            <span>Source: {selectedTrailer.site}</span>
                                            <span>•</span>
                                            <span>Official Trailer</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Trailer List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Available Trailers ({trailers.length})
                                </h3>
                                
                                {trailers.map((trailer, index) => (
                                    <div
                                        key={trailer.id}
                                        onClick={() => handleTrailerSelect(trailer)}
                                        className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                                            selectedTrailer?.id === trailer.id
                                                ? 'ring-2 ring-red-500 scale-105'
                                                : 'hover:scale-105'
                                        }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={trailer.thumbnail}
                                                alt={trailer.title}
                                                className="w-full h-24 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-light-100/5">
                                            <p className="text-white text-sm font-medium line-clamp-2">
                                                {trailer.title}
                                            </p>
                                            <p className="text-light-200 text-xs mt-1">
                                                {trailer.site}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-light-100/10 flex justify-between items-center">
                    <div className="text-light-200 text-sm">
                        {trailers.length > 0 && (
                            <>Click on any trailer thumbnail to watch</>
                        )}
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-light-100/10 text-white rounded-lg hover:bg-light-100/20 transition-colors"
                        >
                            Close
                        </button>
                        
                        {trailers.length > 0 && (
                            <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                More on YouTube
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal; 