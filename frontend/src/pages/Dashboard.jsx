import "../styles/profile.css";
import Chat from "./Chat";
import Sidebar from "../components/Sidebar";
import Matches from "../components/Matches";
import { useAuth } from "../components/auth/AuthContext";
import { useState, useEffect } from "react";
import MatchCard from "../components/dashboard/MatchCard";
import { Author } from "./Chat";
import { getAcceptedMatches } from "../api/matches";

function Dashboard({ showChatsOverlay = false, setShowChatsOverlay = () => {} }) {
    const [acceptedMatches, setAcceptedMatches] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentChatID, setCurrentChatID] = useState(null);
    const [showChatWindow, setShowChatWindow] = useState(false);
    const { token, user } = useAuth();
    const currentUserAuthor = new Author(user?.id, user?.username);

    const handleChatClick = (match) => {
        // Toggle chat - if clicking the same chat, close it
        if (currentChatID === match.id) {
            setCurrentChatID(null);
            setShowChatWindow(false); // Close mobile window if toggling off
        } else {
            setCurrentChatID(match.id);
        }
        setShowChatsOverlay(false);
    };

    const handleCloseChatWindow = () => {
        setShowChatWindow(false);
        setCurrentChat(null);
    };

    const handleCloseChatsOverlay = () => {
        setShowChatsOverlay(false);
    };

    console.log(acceptedMatches)

    return (
        <div className="flex flex-row h-screen bg-linear-to-br from-secondary to-primary">
            {/* Desktop Left sidebar - Chats (hidden on mobile) */}
            <div className="hidden animate-fade-in duration-100 flex-1 md:flex ml-16 bg-secondary border-r border-accent flex-col">
                {/*<div className="p-4 border-b border-accent">
                    <h2 className="text-2xl font-bold text-white text-center">Chats</h2>
                </div>*/}
                <div className="flex flex-col overflow-y-auto space-y-1">
                    {acceptedMatches.map((match, index) => {
                        return <button
                            key={match.id}
                            onClick={() => handleChatClick(match)}
                            className={`w-full p-4 text-left animate-fade-in ${
                                currentChatID === match.id
                                    ? 'bg-accent text-gray-900 shadow-lg'
                                    : 'bg-white/40 text-gray-800 hover:bg-white hover:shadow-md'
                            }`}
                            style={{ animationDuration: `${index * 0.1}s` }}
                        >
                            <div className="flex flex-row items-center gap-2 font-semibold">
                                <img className="w-10" src="#"></img>
                                <p>{match.user2_username}</p>
                                <div className="font-light flex flex-row justify-end w-full">
                                    {true /* Has a new message condition */ ? <div className="w-3 h-3 bg-secondary rounded-4xl"></div> : null}
                                </div>
                            </div>
                        </button>
                    })}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1/2 animate-fade-in relative flex items-start justify-center p-6 md:items-center md:p-0">
                {currentChatID != null && !showChatsOverlay ? (
                    <div className="w-full h-[80vh] bg-white rounded-2xl shadow-2xl md:rounded-none md:shadow-none overflow-hidden md:h-full ">
                        <Chat matches={acceptedMatches} currentChatID={currentChatID} currentUser={currentUserAuthor} />
                    </div>
                ) : (
                    <MatchCard token={token} acceptedMatches={acceptedMatches} setAcceptedMatches={setAcceptedMatches} />
                )}
            </div>

            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Chats Overlay */}
            {showChatsOverlay && (
                <div className="fixed inset-0 z-40 md:hidden backdrop-blur-xs bg-opacity-50" onClick={handleCloseChatsOverlay}>
                    <div 
                        className="absolute bottom-14 left-0 right-0 bg-pink-200 rounded-t-3xl shadow-2xl max-h-[70vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/20 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Chats</h2>
                            <button 
                                onClick={handleCloseChatsOverlay}
                                className="text-white hover:text-gray-200 p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {acceptedMatches.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleChatClick(chat)}
                                    className="w-full p-4 rounded-lg text-left transition-all bg-white/80 text-gray-800 hover:bg-white hover:shadow-md"
                                >
                                    <div className="font-semibold">{chat.user2_username}</div>
                                    <div className="text-sm text-gray-600 mt-1">Click to view chat</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Chat Window Overlay */}
            {showChatWindow && (
                <div className="fixed inset-0 z-50 md:hidden bg-white">
                    <div className="h-full flex flex-col pb-16">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-4 flex items-center shadow-md">
                            <button 
                                onClick={handleCloseChatWindow}
                                className="text-white hover:text-gray-200 mr-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>
                            <h2 className="text-xl font-bold text-white">{currentChat.recipient}</h2>
                        </div>
                        
                        {/* Chat Content */}
                        <div className="flex-1 overflow-hidden">
                            <Chat conversation={currentChat} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;