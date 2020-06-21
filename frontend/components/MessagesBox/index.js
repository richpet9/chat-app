import React, { useEffect, useRef } from "react";

import "./index.scss";

const MessagesBox = ({ messages }) => {
    const containerRef = useRef();

    useEffect(() => {
        containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }, [messages]);

    return (
        <div
            className="messages-container"
            style={{ height: window.innerHeight - 104 }}
            ref={containerRef}
        >
            {messages.map((message, messageIndex) => {
                return (
                    <div key={`message-${messageIndex}`} className="message">
                        <span className="message-from">{message.from}</span>
                        <div className="message-text">{message.message}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessagesBox;
