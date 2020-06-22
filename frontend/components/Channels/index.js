import React from "react";

import "./index.scss";

const Channels = ({
    channels,
    currentChannel,
    changeChannel,
    placeholder,
    openNewChannelForm,
}) => {
    return (
        <div className="channel-container">
            {channels &&
                channels.map((channel) => (
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
                onClick={openNewChannelForm}
            >
                <i className="fas fa-plus"></i>
                <span>Add Channel</span>
            </button>
        </div>
    );
};

export default Channels;
