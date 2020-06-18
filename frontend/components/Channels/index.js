import React from "react";

import "./index.scss";

const Channels = ({ channels, currentChannel, changeChannel, placeholder }) => {
    if (placeholder) {
        return (
            <div className="channel-container">
                {["medium", "small", "large"].map((size) => (
                    <span
                        key={size}
                        className={"placeholder " + size}
                        style={{ display: "block" }}
                    />
                ))}
            </div>
        );
    } else {
        return (
            <div className="channel-container">
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        className={
                            "channel-button " +
                            (currentChannel && channel.id == currentChannel.id
                                ? "active"
                                : "")
                        }
                        onClick={() => changeChannel(channel)}
                    >
                        <i className={"fas fa-hashtag"}></i>
                        <span>{channel.name}</span>
                    </button>
                ))}
            </div>
        );
    }
};

export default Channels;
