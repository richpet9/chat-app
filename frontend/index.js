import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";
import Channels from "./components/Channels";
import ChannelInfo from "./components/ChannelInfo";
import MessagesBox from "./components/MessagesBox";
import MessageInput from "./components/MessageInput";
import BrandMark from "./components/BrandMark";

import "./index.scss";

const pubnub = new PubNub({
    publishKey: "pub-c-40ab95dd-4ce4-4968-86a4-39fa28f1c3b5",
    subscribeKey: "sub-c-7baebe72-b0b7-11ea-af7b-9a67fd50bac3",
    uuid: "test-user",
});

// TODO: Get channels from DB api
let channels = [
    { name: "Awesome Channel", id: "awesome-channel" },
    { name: "Fun Channel", id: "fun-channel" },
    { name: "Dance Channel", id: "dance-channel" },
];

const App = () => {
    const pubnub = usePubNub();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentChannel, setCurrentChannel] = useState(null);

    const sendMessage = (message) => {
        pubnub.publish(
            {
                channel: currentChannel.id,
                message,
            },
            (status, response) => {
                if (!status.error) {
                    setMessage("");
                }
            }
        );
    };

    const changeChannel = (channel) => {
        if (channel) {
            setMessage("");
            setCurrentChannel(channel);
            // TODO: Get message history from MongoDB api
            setMessages([]);
        } else {
            setCurrentChannel(null);
            setMessages([]);
        }
        window.location.hash = channel.id;
    };

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (channels.map((channel) => channel.id).includes(hash)) {
            changeChannel(channels.filter((channel) => channel.id == hash)[0]);
        } else if (channels.length > 0) {
            changeChannel(channels[0]);
        } else {
            changeChannel(null);
        }
    }, []);

    useEffect(() => {
        pubnub.addListener({
            message: (messageEvent) => {
                setMessages([
                    ...messages,
                    {
                        from: messageEvent.publisher,
                        message: messageEvent.message,
                    },
                ]);
            },
        });
    }, [messages]);

    useEffect(() => {
        pubnub.subscribe({ channels: channels.map((channel) => channel.id) });
    }, []);

    return (
        <div className="App">
            <div className="left-side-panel">
                <BrandMark />
                <Channels
                    channels={channels}
                    currentChannel={currentChannel} // TODO: move channel state to channels component
                    changeChannel={changeChannel}
                    placeholder={false}
                />
            </div>
            <div className="center-panel">
                <ChannelInfo channel={currentChannel} />
                <MessagesBox messages={messages} />
                <MessageInput
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    );
};

const Root = () => {
    return (
        <PubNubProvider client={pubnub}>
            <App />
        </PubNubProvider>
    );
};

ReactDOM.render(<Root />, document.getElementById("root"));
