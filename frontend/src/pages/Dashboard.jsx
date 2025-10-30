// import "../styles/profile.css";
// import Chat from "./Chat";
// import Sidebar from "../components/Sidebar";
// import { useState } from "react";

// const exampleChats = [
//     {
//         id: 1,
//         recipient: "Example1"
//     }, 
//     {
//         id: 2,
//         recipient: "Example2"
//     }
// ]

// function Dashboard() {
//     const [currentChat, setCurrentChat] = useState(null);

//     const handleChatClick = (chat) => {
//         // Toggle chat - if clicking the same chat, close it
//         if (currentChat?.id === chat.id) {
//             setCurrentChat(null);
//         } else {
//             setCurrentChat(chat);
//         }
//     };

//     return (
//         <div className="flex flex-row h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500">
//             <Sidebar />
            
//             {/* Left sidebar with chats */}
//             <div className="w-80 ml-16 bg-pink-200 border-r border-white/20 flex flex-col">
//                 <div className="p-4 border-b border-white/20">
//                     <h2 className="text-2xl font-bold text-white text-center">Chats</h2>
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                     {exampleChats.map((chat) => (
//                         <button
//                             key={chat.id}
//                             onClick={() => handleChatClick(chat)}
//                             className={`w-full p-4 rounded-lg text-left transition-all ${
//                                 currentChat?.id === chat.id
//                                     ? 'bg-white text-gray-900 shadow-lg'
//                                     : 'bg-white/80 text-gray-800 hover:bg-white hover:shadow-md'
//                             }`}
//                         >
//                             <div className="font-semibold">{chat.recipient}</div>
//                             <div className="text-sm text-gray-600 mt-1">Click to view chat</div>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Main content area */}
//             <div className="flex-1 flex items-center justify-center p-6">
//                 {currentChat ? (
//                     <div className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//                         <Chat conversation={currentChat} />
//                     </div>
//                 ) : (
//                     <div className="w-full max-w-md">
//                         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//                             {/* Profile image placeholder */}
//                             <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
//                                 <div className="text-center text-gray-500">
//                                     <svg 
//                                         xmlns="http://www.w3.org/2000/svg" 
//                                         className="h-32 w-32 mx-auto mb-4 opacity-50" 
//                                         fill="none" 
//                                         viewBox="0 0 24 24" 
//                                         stroke="currentColor"
//                                     >
//                                         <path 
//                                             strokeLinecap="round" 
//                                             strokeLinejoin="round" 
//                                             strokeWidth={1} 
//                                             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
//                                         />
//                                     </svg>
//                                     <p className="text-lg">No Image</p>
//                                 </div>
//                             </div>
                            
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Dashboard;
import "../styles/profile.css";
import Chat from "./Chat";
import Sidebar from "../components/Sidebar";
import Matches from "../components/Matches";
import { useAuth } from "../components/AuthContext";
import { useState } from "react";

const exampleChats = [
    { id: 1, recipient: "Example1" },
    { id: 2, recipient: "Example2" }
];

const exampleMatches = [
    { id: 1, name: "Match1", genre: "rock" },
    { id: 2, name: "Match2", genre: "rock" },
    { id: 3, name: "Match3", genre: "rock" }
];

function Dashboard() {
    const [currentChat, setCurrentChat] = useState(null);
    const { token, user } = useAuth();

    const handleChatClick = (chat) => {
        // Toggle chat - if clicking the same chat, close it
        if (currentChat?.id === chat.id) {
            setCurrentChat(null);
        } else {
            setCurrentChat(chat);
        }
    };

    return (
        <div className="flex flex-row h-screen bg-gradient-to-br from-rose-300 via-pink-400 to-rose-500">
            {/* Sidebar */}
            <Sidebar />

            {/* Left sidebar - Chats */}
            <div className="w-80 ml-16 bg-pink-200 border-r border-white/20 flex flex-col">
                <div className="p-4 border-b border-white/20">
                    <h2 className="text-2xl font-bold text-white text-center">Chats</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {exampleChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => handleChatClick(chat)}
                            className={`w-full p-4 rounded-lg text-left transition-all ${
                                currentChat?.id === chat.id
                                    ? 'bg-white text-gray-900 shadow-lg'
                                    : 'bg-white/80 text-gray-800 hover:bg-white hover:shadow-md'
                            }`}
                        >
                            <div className="font-semibold">{chat.recipient}</div>
                            <div className="text-sm text-gray-600 mt-1">Click to view chat</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center p-6">
                {currentChat ? (
                    <div className="w-full h-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <Chat conversation={currentChat} />
                    </div>
                ) : (
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Profile image placeholder */}
                            <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-32 w-32 mx-auto mb-4 opacity-50" 
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
                                    <p className="text-lg">No Image</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right sidebar - Matches */}
            <Matches token={token} />
        </div>
    );
}

export default Dashboard;
