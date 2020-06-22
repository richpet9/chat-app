import React, { useState } from "react";

import "./index.scss";

const MessageInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");

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
                        setMessage("");
                    }
                }}
            />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    sendMessage(message);
                    setMessage("");
                }}
            >
                <i className="fas fa-paper-plane"></i>
            </button>
        </div>
    );
};

export default MessageInput;
