import React, { useEffect, useState } from "react";

import "./index.scss";

const MessagesBox = ({ messages }) => {
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(document.getElementById("channel-info-bar").clientHeight);
    }, []);

    return (
        <div
            className="messages-container"
            style={{
                height: window.innerHeight + "px",
                top: height + "px",
            }}
        >
            {messages.map((message, messageIndex) => {
                return (
                    <div key={`message-${messageIndex}`} className="message">
                        <span className="message-from">Richie</span>
                        <div className="message-text">{message}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default MessagesBox;
