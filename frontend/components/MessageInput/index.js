import React from "react";

const MessageInput = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="message-input-container">
      <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          sendMessage(message);
        }}
      >
        Send Message
      </button>
    </div>
  );
};

export default MessageInput;
