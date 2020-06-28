import React, { useState, useEffect } from "react";

import "./index.scss";

const MessageInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [spam, setSpam] = useState(false);
    const [msgCooldown, setMsgCooldown] = useState(0);

    const submitMessage = () => {
        if (msgCooldown > 0) {
            setSpam(true);
        } else {
            sendMessage(message);
            setMessage("");
            setMsgCooldown(4);
        }
    };

    useEffect(() => {
        if (msgCooldown == 0) {
            setSpam(false);
            return;
        }

        setTimeout(() => {
            setMsgCooldown(msgCooldown - 1);
        }, 1000);
    }, [msgCooldown]);

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
                        submitMessage();
                    }
                }}
            />
            <button
                onClick={(e) => {
                    e.preventDefault();
                    submitMessage();
                }}
            >
                <i className="fas fa-paper-plane"></i>
            </button>

            {spam && (
                <span className="message-cooldown">{`Please wait ${msgCooldown} more seconds before sending another message.`}</span>
            )}
        </div>
    );
};

export default MessageInput;
