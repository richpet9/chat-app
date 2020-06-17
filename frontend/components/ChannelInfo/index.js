import React from "react";

import "./index.scss";

const ChannelInfo = ({ channel }) => {
    return (
        <div className="channel-info-container" id="channel-info-bar">
            <div className="channel-name">
                <i className="fas fa-hashtag">#</i>
                <span>{channel}</span>
            </div>
            <div className="channel-meta">
                <span>
                    Channel description information relating to it's purpose.
                </span>
            </div>
        </div>
    );
};

export default ChannelInfo;
