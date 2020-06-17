import React from "react";

import "./index.scss";

const MessageInput = ({ message, setMessage, sendMessage }) => {
    return (
        <div className="message-input-container" id="message-input-bar">
            <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.keyCode == 13) {
                        // Pressed enter
                        e.preventDefault();
                        sendMessage(message);
                    }
                }}
            />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    sendMessage(message);
                }}
            >
                <i className="fas fa-paper-plane"></i>
            </button>
        </div>
    );
};

export default MessageInput;
