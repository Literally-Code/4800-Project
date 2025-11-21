import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { getMatches, getAcceptedMatches, acceptMatch, rejectMatch } from "../../api/matches";
import { API_BASE_URL } from "../../config";

const ProfileImage = ({ currentMatch }) => {
    return (
    <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center min-h-0">
        {currentMatch?.profile_image ? (
            <img 
                src={API_BASE_URL + currentMatch.profile_image}
                alt={currentMatch.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                        <div class="text-center text-gray-500">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                class="h-20 w-20 mx-auto mb-2 opacity-50" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    stroke-width="1" 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                />
                            </svg>
                            <p class="text-sm">No Profile Image</p>
                        </div>
                    `;
                }}
            />
        ) : (
            <div className="text-center text-gray-500">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-20 w-20 mx-auto mb-2 opacity-50" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                </svg>
                <p className="text-sm">No Profile Image</p>
            </div>
        )}
    </div>)
}

const ProfileInfo = ({ currentMatch }) => {
    return (
    <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
            {currentMatch?.username || 'Unknown User'}
            {currentMatch?.age && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                    , {currentMatch.age}
                </span>
            )}
        </h2>

        {currentMatch?.biography && (
            <p className="text-gray-700 text-sm mb-2 line-clamp-2">{currentMatch.biography}</p>
        )}

        {currentMatch?.location && (
            <p className="text-gray-600 text-sm mb-2">📍 {currentMatch.location}</p>
        )}

        {/* Favorite song */}
        {currentMatch?.fav_songs && currentMatch.fav_songs.length > 0 && (
            <div className="mb-2">
                <h3 className="text-xs font-semibold text-gray-600 mb-1">
                    Favorite Song
                </h3>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="w-full">
                        {(() => {
                            const track = currentMatch.fav_songs[0];
                            const id = track.spotify_id || track.id;
                            const raw =
                                track.spotify_url ||
                                (track.external_urls && track.external_urls.spotify) ||
                                track.url ||
                                track.href;

                            let embedUrl = null;
                            if (id) {
                                embedUrl = `https://open.spotify.com/embed/track/${id}?compact=1`;
                            } else if (typeof raw === 'string') {
                                const uriMatch = raw.match(/spotify:track:([a-zA-Z0-9]+)/);
                                const urlMatch = raw.match(/track\/([a-zA-Z0-9]+)/);
                                const trackId = (uriMatch && uriMatch[1]) || (urlMatch && urlMatch[1]);
                                if (trackId) embedUrl = `https://open.spotify.com/embed/track/${trackId}?compact=1`;
                            }

                            return embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    width="100%"
                                    height="80"
                                    frameBorder="0"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    {track.album_image_url ? (
                                        <img
                                            src={track.album_image_url}
                                            alt={track.name}
                                            className="w-12 h-12 rounded object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {track.name}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        )}

        {/* Favorite artists */}
        {currentMatch?.fav_artists && currentMatch.fav_artists.length > 0 && (
            <FavoriteArtists currentMatch={currentMatch} />
        )}
    </div>)
}

const FavoriteArtists = ({ currentMatch }) => {
    return (
    <div className="mb-2">
        <h3 className="text-xs font-semibold text-gray-600 mb-1">
            Top Artists
        </h3>
        <div className="flex flex-wrap gap-1">
            {currentMatch.fav_artists.slice(0, 3).map(artist => (
                <span 
                    key={artist.id}
                    className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs"
                >
                    {artist.name}
                </span>
            ))}
        </div>
    </div>)
}

const ActionButtons = ({ handleDecline, handleAccept }) => {
    return (
    <div className="flex justify-center gap-3 mt-3">
        <button 
            type="button" 
            onClick={handleDecline} 
            className="w-32 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
            ✖ Reject
        </button>
        <button 
            type="button" 
            onClick={handleAccept} 
            className="w-32 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
            ✓ Accept
        </button>
    </div>)
}

const SwipeableCard = ({ match, onAccept, onReject, isTop }) => {
    const x = useMotionValue(0);
    
    // Rotation based on swipe position
    const rotateRaw = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    
    // Add color overlays for swipe direction
    const rejectOpacity = useTransform(x, [-200, -50, 0], [1, 0.5, 0]);
    const acceptOpacity = useTransform(x, [0, 50, 200], [0, 0.5, 1]);
    
    const rotate = useTransform(() => {
        const offset = isTop ? 0 : (match.id % 2 ? 3 : -3);
        return `${rotateRaw.get() + offset}deg`;
    });

    const handleDragEnd = () => {
        const xValue = x.get();
        if (Math.abs(xValue) > 100) {
            if (xValue > 0) {
                onAccept();
            } else {
                onReject();
            }
        }
    };

    return (
        <motion.div
            className="absolute w-full h-full"
            style={{
                x,
                rotate,
                opacity,
                cursor: isTop ? 'grab' : 'default',
            }}
            animate={{
                scale: isTop ? 1 : 0.95,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{
                left: 0,
                right: 0,
            }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            whileDrag={{ cursor: 'grabbing' }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative h-full flex flex-col">
                {/* Reject overlay (red) */}
                <motion.div 
                    className="absolute inset-0 bg-red-500 flex items-center justify-center z-10 pointer-events-none"
                    style={{ opacity: rejectOpacity }}
                >
                    <div className="text-white text-6xl font-bold rotate-12">✖</div>
                </motion.div>
                
                {/* Accept overlay (green) */}
                <motion.div 
                    className="absolute inset-0 bg-green-500 flex items-center justify-center z-10 pointer-events-none"
                    style={{ opacity: acceptOpacity }}
                >
                    <div className="text-white text-6xl font-bold -rotate-12">✓</div>
                </motion.div>

                {/* Profile image - takes up remaining space */}
                <ProfileImage currentMatch={match} />

                {/* Profile info - compact, fixed at bottom */}
                <div className="flex-shrink-0">
                    <ProfileInfo currentMatch={match} />
                </div>

                {/* Action buttons - now inside the card */}
                {isTop && (
                    <div className="px-4 pb-4 flex-shrink-0">
                        <ActionButtons handleDecline={onReject} handleAccept={onAccept} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const MatchCard = ({ token, acceptedMatches, setAcceptedMatches }) => {
    const [potentialMatches, setPotentialMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animatingOut, setAnimatingOut] = useState(false);

    const currentMatch = potentialMatches[0];
    const nextMatch = potentialMatches[1];
    
    useEffect(() => {
        fetchAcceptedMatches()
    }, [])

    const handleDecline = async () => {
        if (!currentMatch || animatingOut) return;
        
        setAnimatingOut(true);

        try {
            await rejectMatch(token, currentMatch.id);
            console.log("Match rejected:", currentMatch.username);
            
            // Remove from stack after animation
            setTimeout(() => {
                setPotentialMatches(prev => prev.slice(1));
                setAnimatingOut(false);
            }, 300);
        } catch (err) {
            console.error("Error rejecting match:", err);
            setAnimatingOut(false);
            alert("Failed to reject match. Please try again.");
        }
    };

    const handleAccept = async () => {
        if (!currentMatch || animatingOut) return;
        
        setAnimatingOut(true);

        try {
            await acceptMatch(token, currentMatch.id);
            console.log("Match accepted:", currentMatch.username);
            
            // Add to accepted matches immediately for UI responsiveness
            setAcceptedMatches([...acceptedMatches, currentMatch]);
            
            // Also refresh accepted matches from server to ensure consistency
            fetchAcceptedMatches();
            
            // Remove from stack after animation
            setTimeout(() => {
                setPotentialMatches(prev => prev.slice(1));
                setAnimatingOut(false);
            }, 300);
        } catch (err) {
            console.error("Error accepting match:", err);
            setAnimatingOut(false);
            alert("Failed to accept match. Please try again.");
        }
    };

    // Fetch accepted matches
    const fetchAcceptedMatches = async () => {
        if (!token) return;
        
        try {
            const data = await getAcceptedMatches(token);
            console.log("Fetched accepted matches:", data);
            setAcceptedMatches(data);
        } catch (err) {
            console.error("Error fetching accepted matches:", err);
        }
    };

    // Fetch potential matches and accepted matches on component mount
    useEffect(() => {
        if (!token) return;

        setLoading(true);
        
        Promise.all([
            getMatches(token),
            getAcceptedMatches(token).catch(err => {
                console.error("Error fetching accepted matches:", err);
                return { matches: [] };
            })
        ])
            .then(([potentialData, acceptedData]) => {
                console.log("Fetched potential matches:", potentialData);
                console.log("Fetched accepted matches:", acceptedData);
                setPotentialMatches(potentialData.matches || []);
                setAcceptedMatches(acceptedData || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching matches:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full relative h-[80vh] bottom-0 max-w-md my-5">
            {loading ? (
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center h-full flex items-center justify-center">
                    <p className="text-gray-600">Loading matches...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center h-full flex items-center justify-center">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            ) : !currentMatch ? (
                <div className="bg-white rounded-2xl shadow-2xl p-8 text-center h-full flex items-center justify-center">
                    <p className="text-gray-600">No more matches available</p>
                </div>
            ) : (
                <div className="relative w-full h-full">
                    {/* Show next card underneath for depth */}
                    {nextMatch && (
                        <SwipeableCard
                            key={nextMatch.id}
                            match={nextMatch}
                            onAccept={() => {}}
                            onReject={() => {}}
                            isTop={false}
                        />
                    )}
                    
                    {/* Current card on top */}
                    <SwipeableCard
                        key={currentMatch.id}
                        match={currentMatch}
                        onAccept={handleAccept}
                        onReject={handleDecline}
                        isTop={true}
                    />
                </div>
            )}
        </div>
    );
};

export default MatchCard;