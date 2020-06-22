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
                if (hours >= 12) {
                    half = "PM";
                    if (hours > 12) {
                        hours = hours - 12;
                    }
                }
                let minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + date.getMinutes();
                }

                const dateString = `${hours}:${minutes} ${half}`;

                return (
                    <div key={`message-${messageIndex}`} className="message">
                        <span className="message-from">{message.from}</span>
                        <span className="message-time">{dateString}</span>
                        <div className="message-text">{message.message}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessagesBox;
