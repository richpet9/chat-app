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
                const date = new Date(message.timeToken);
                let hours = date.getHours();
                let half = "AM";
                if (hours > 12) {
                    half = "PM";
                    hours = hours - 12;
                }
                const dateString = `${hours}:${date.getMinutes()} ${half}`;
                return (
                    <div key={`message-${messageIndex}`} className="message">
                        <span className="message-from">{message.from}</span>
                        {/* <span className="message-time">{dateString}</span> */}
                        <div className="message-text">{message.message}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessagesBox;
