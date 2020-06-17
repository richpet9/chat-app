import React from "react";

import "./index.scss";

const Channels = ({ channels, currentChannel, changeChannel }) => {
    return (
        <div className="channel-container">
            {channels.map((channel) => (
                <button
                    key={channel}
                    className={
                        "channel-button " +
                        (channel == currentChannel ? "active" : "")
                    }
                    onClick={() => changeChannel(channel)}
                >
                    <i className="fas fa-hashtag">#</i>
                    <span>{channel}</span>
                </button>
            ))}
        </div>
    );
};

export default Channels;
