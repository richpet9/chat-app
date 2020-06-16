import React from "react";

const Channels = ({ channels, changeChannel }) => {
    return (
        <div className="channel-container">
            {channels.map((channel) => (
                <input
                    key={channel}
                    type="button"
                    value={channel}
                    onClick={() => changeChannel(channel)}
                />
            ))}
        </div>
    );
};

export default Channels;
