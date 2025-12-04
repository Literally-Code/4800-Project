import { useState, useEffect, useRef } from "react";
import Message from "../components/Message";
import { useAuth } from "../components/auth/AuthContext";
import { API_BASE_URL } from "../config";
import { connectWebsocket, getChats, sendMessage } from "../api/chat";

const Chat = ({ matches, currentChatID, currentUser }) =>
{
    const [userContent, setUserContent] = useState('');
    const [currentChat, setCurrentChat] = useState([]);
    const [response, setResponse] = useState('');
    const [websocket, setWebsocket] = useState(null);

    const [isHoldingShift, setIsHoldingShift] = useState(false);
    const placeholderText = 'Send a message...';

    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [currentChat]);

    // Update the messages state when a response from the server is loaded
    useEffect(() => 
    {
        // Add a check to ensure we have a chat ID before doing anything
        if (!currentChatID) return; 

        // Get chats from chat ID - THIS IS NOW TRIGGERED ON currentChatID CHANGE
        getChats(currentChatID)
            .then((res) => {
                if (res.status == 200)
                {
                    setCurrentChat(res.data)
                }
            })

        // Use web sockets - Reconnects for the new chat room
        const socket = connectWebsocket(currentChatID);

        socket.addEventListener("open", event => {
            console.log("Websocket opened ", event)
        })

        socket.addEventListener("message", event => {
            const data = JSON.parse(event.data);
            const newMessage = data.message;
            
            setCurrentChat((oldChat) => {
                return [...oldChat, newMessage];
            })
        })

        setWebsocket(socket);

        setResponse('');

        // The return function closes the old socket connection when the chat ID changes
        return () => { console.log("Websocket closed"); socket.close() };
    }, [currentChatID]); // <-- **CRITICAL CHANGE**: Dependency array now includes currentChatID

    // Returns true if the button should be disabled, false if not
    const isButtonDisabled = () => 
    {
        return userContent.length === 0 || userContent === '\n';
    };

    // Event Handlers

    // Handles the process for when the user submits a message
    // Creates the next two messages: the user message and the assistant response skeleton while waiting for a response
    // If the last assistant response was unsuccessful, then it will override the unsuccessful response and user message that prompted it
    const handleReturn = async () => 
    {
        const newMessage = {author: currentUser, content: userContent};

        // setCurrentChat((oldChat) => {
        //     return [...oldChat, newMessage];
        // })

        sendMessage(currentChatID, newMessage.author.username, newMessage.content)

        setUserContent("");
    };

    // Handles the onBlur event for the input field, updating the placeholder and text accordingly
    const handleOnBlur = (event) => 
    {
        if (event.target.innerText === '' || event.target.innerText === '\n')
            event.target.innerText = placeholderText;
        else
            event.target.innerText;
    };

    // Handles the onFocus event for the input field. Intended for clearing the placeholder text upon focusing
    const handleOnFocus = (event) => 
    {
        event.target.innerText = '';
    };

    const handleKeyDown = (event) => 
    {
        if (event.key == 'Shift')
            {
                setIsHoldingShift(true);
            }
        if (event.key == 'Enter' && !isHoldingShift)
        {
            event.target.innerText = '';
            event.target.blur();
            handleReturn();
        }
    };

    const handleKeyUp = (event) => 
    {
        setUserContent(event.target.innerText);
        if (event.key == 'Shift')
        {
            setIsHoldingShift(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages area */}
            <div ref={ref} className="flex-1 overflow-y-auto p-8 bg-gradient-to-br bg-lm-light-bg z-4 shadow">
                {currentChat.map((message, index) => (
                    <Message key={index} author={new Author(message.sender, message.sender_username)} currentUser={currentUser} text={message.content} />
                ))}
                {currentChat.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-3xl font-bold text-white">The beginning of your conversation...</h1>
                    </div>
                )}
            </div>
            
            {/* Input area at bottom */}
            <div className="p-4 bg-lm-dark-bg">
                <div className="flex flex-row gap-2 w-full">
                    <div 
                        className="flex-1 p-3 border border-gray-300 rounded-lg bg-lm-light-bg text-black min-h-[50px] max-h-[150px] overflow-y-auto focus:outline-none focus:border-rose-400" 
                        data-testid="input" 
                        contentEditable="true" 
                        suppressContentEditableWarning={true} 
                        onBlur={handleOnBlur} 
                        onFocus={handleOnFocus} 
                        onKeyDown={handleKeyDown} 
                        onKeyUp={handleKeyUp}
                    >
                        {placeholderText}
                    </div>
                    <button 
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            isButtonDisabled() 
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                : "bg-rose-500 text-white hover:bg-rose-600"
                        }`} 
                        data-testid="submit" 
                        onClick={handleReturn} 
                        disabled={isButtonDisabled()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Author class for describing messages
 * @param {string} id - User's ID
 * @param {string} username - User's username
 */
export class Author {
    constructor(id, username)
    {
        this.id = id;
        this.username = username;
    }
}

export default Chat;