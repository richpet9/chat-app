import React from "react";

import "./index.scss";

const Channels = ({
    channels,
    currentChannel,
    changeChannel,
    placeholder,
    toggleFloatingWindow,
}) => {
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
                        <i className="fas fa-hashtag"></i>
                        <span>{channel.name}</span>
                    </button>
                ))}
                <button
                    className="new-channel-button channel-button"
                    onClick={() => toggleFloatingWindow()}
                >
                    <i className="fas fa-plus"></i>
                    <span>Add Channel</span>
                </button>
            </div>
        );
    }
};

export default Channels;
