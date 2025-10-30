import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

export default function Matches({ token }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setMatches([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`${API_BASE_URL}matches/`, {
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Matches fetched:", data); // debug
            if (Array.isArray(data)) {
                setMatches(data);
            } else {
                setMatches([]); // fallback if data isn’t an array
            }
        })
        .catch(err => {
            console.error("Fetch error:", err);
            setError(err.message);
        })
        .finally(() => setLoading(false));
    }, [token]);

    return (
        <div className="w-80 mr-8 bg-pink-200 border-l border-white/20 flex flex-col">
            <div className="p-4 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white text-center">Matches</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && <p className="text-white text-center">Loading matches...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && !error && matches.length === 0 && (
                    <p className="text-white text-center">No matches found.</p>
                )}

                {(matches || []).map(match => (
                    <div
                        key={match.id}
                        className="w-full p-4 rounded-lg bg-white/80 text-gray-800 hover:bg-white hover:shadow-md transition-all"
                    >
                        <div className="font-semibold">{match.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                            Favorite genres: {(match.genres || []).join(", ")}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
