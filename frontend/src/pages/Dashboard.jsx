import "../styles/profile.css";
import Chat from "./Chat";
import Sidebar from "../components/Sidebar";
import Matches from "../components/Matches";
import { useAuth } from "../components/auth/AuthContext";
import { useState, useEffect } from "react";
import MatchCard from "../components/dashboard/MatchCard";
import { Author } from "./Chat";

function Dashboard() {
    const [acceptedMatches, setAcceptedMatches] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentChatID, setCurrentChatID] = useState(null);
    const { token, user } = useAuth();
    const currentUserAuthor = new Author(user?.id, user?.username);

    const handleChatClick = (match) => {
        // Toggle chat - if clicking the same chat, close it
        if (currentChatID === match.id) {
            setCurrentChatID(null);
        } else {
            setCurrentChatID(match.id);
        }
    };

    const matchGetOtherUser = (match) => {
        if (match.user1_id == currentUserAuthor.id)
        {
            return match.user2_username;
        }
        return match.user1_username;
    }

    console.log(acceptedMatches)

    return (
        <div className="flex flex-row h-screen bg-linear-to-br from-rose-300 via-pink-400 to-rose-500">
            
            {/* Left sidebar - Chats */}
            <div className="w-80 ml-16 bg-pink-200 border-r border-white/20 flex flex-col">
                <div className="p-4 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white text-center">Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {acceptedMatches.map((match) => (
                        <button
                            key={match.id}
                            onClick={() => handleChatClick(match)}
                            className={`w-full p-4 rounded-lg text-left transition-all ${
                                currentChat?.id === match.id
                                    ? 'bg-white text-gray-900 shadow-lg'
                                    : 'bg-white/80 text-gray-800 hover:bg-white hover:shadow-md'
                            }`}
                        >
                            <div className="font-semibold">{matchGetOtherUser(match)}</div>
                            <div className="text-sm text-gray-600 mt-1">Click to view chat</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center p-6">
                {currentChatID ? (
                    <div className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <Chat matches={acceptedMatches} currentChatID={currentChatID} currentUser={currentUserAuthor} />
                    </div>
                ) : (
                    <MatchCard token={token} acceptedMatches={acceptedMatches} setAcceptedMatches={setAcceptedMatches} />
                )}
            </div>
        </div>
    );
}

export default Dashboard;