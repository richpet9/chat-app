import React from "react";

const MessagesBox = ({ messages }) => {
  return (
    <div className="messages-container">
      {messages.map((message, messageIndex) => {
        return <div key={`message-${messageIndex}`}>{message}</div>;
      })}
    </div>
  );
};

export default MessagesBox;
