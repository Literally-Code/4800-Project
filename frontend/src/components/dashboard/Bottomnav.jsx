import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const BottomNav = ({ onChatsClick = null, showChatsOverlay = false }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
            ), 
            label: "Home", 
            path: "/dashboard",
            onClick: null
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
            ), 
            label: "Chats", 
            path: null,
            onClick: onChatsClick,
            showOnlyOn: ["/dashboard"] // Only show chats button on dashboard
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            ), 
            label: "Profile", 
            path: "/profile",
            onClick: null
        },
        { 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            ), 
            label: "Settings", 
            path: "/matchsettings",
            onClick: null
        }
    ];

    const handleItemClick = (item, e) => {
        if (item.onClick) {
            e.preventDefault();
            item.onClick();
        }
    };

    // Filter items based on showOnlyOn property
    const visibleItems = navItems.filter(item => {
        if (item.showOnlyOn) {
            return item.showOnlyOn.includes(location.pathname);
        }
        return true;
    });

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg">
            <div className="flex justify-around items-center h-16 px-2">
                {visibleItems.map((item, index) => {
                    const isActive = (item.path && location.pathname === item.path) || 
                                   (item.label === "Chats" && showChatsOverlay);
                    
                    if (item.path) {
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={(e) => handleItemClick(item, e)}
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                                    isActive ? 'text-rose-500' : 'text-gray-700 hover:text-rose-500'
                                }`}
                            >
                                <div className="w-6 h-6">
                                    {item.icon}
                                </div>
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        );
                    } else {
                        return (
                            <button
                                key={index}
                                onClick={(e) => handleItemClick(item, e)}
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                                    isActive ? 'text-rose-500' : 'text-gray-700 hover:text-rose-500'
                                }`}
                            >
                                <div className="w-6 h-6">
                                    {item.icon}
                                </div>
                                <span className="text-xs mt-1">{item.label}</span>
                            </button>
                        );
                    }
                })}
            </div>
        </nav>
    );
};

export default BottomNav;