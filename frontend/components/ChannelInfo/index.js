import React from "react";

import "./index.scss";

const ChannelInfo = ({ channel }) => {
    return (
        <div className="channel-info-container" id="channel-info-bar">
            <div className="channel-name">
                <i
                    className={
                        "fas fa-hashtag " + (channel ? "" : "placeholder")
                    }
                ></i>
                <span className={channel ? "" : "placeholder medium"}>
                    {channel ? channel.name : ""}
                </span>
            </div>
            <div className="channel-meta">
                <span className={channel ? "" : "placeholder small"}>
                    {channel
                        ? "Channel description information relating to it's purpose."
                        : ""}
                </span>
            </div>
        </div>
    );
};

export default ChannelInfo;
