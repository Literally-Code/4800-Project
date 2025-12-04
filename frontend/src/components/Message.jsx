const colorFromSource = (author, currentUser) => 
{
    if (author.id === currentUser.id)
        return 'bg-secondary';
    return 'bg-lm-dark-bg';
};

const sideFromSource = (author, currentUser) => 
{
    if (author.id === currentUser.id)
        return 'items-end';
    return 'items-start';
    
}

/**
 * 
 * @param {Author} author - The author of the message
 * @param {Author} currentUser - The currently authenticated user as an Author
 * @param {string} author - Message text
 * @returns 
 */
const Message = ({ author, currentUser, text }) =>
{
    return <div>
        <div className={`flex flex-col w-full ${sideFromSource(author, currentUser)}`}>
            <div className={``}>{author.username}</div>
            <div className={`flex relative ${colorFromSource(author, currentUser)} rounded-4xl w-max min-h-0 mb-2`}>
                <div className={`text-left z-1 text-black text-lg max-w-50 p-3 wrap-break-word rounded-xl`}>
                    <div>{text}</div>
                </div>
                <div className={`absolute bottom-0 ${author.id === currentUser.id ? 'right-0' : 'left-0'} ${colorFromSource(author, currentUser)} w-1/2 h-1/2 z-0`}></div>
            </div>
        </div>
    </div>;
};

export default Message;