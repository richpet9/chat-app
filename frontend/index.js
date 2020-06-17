import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider, PubNubConsumer } from "pubnub-react";
import Channels from "./components/Channels";
import ChannelInfo from "./components/ChannelInfo";
import MessagesBox from "./components/MessagesBox";
import MessageInput from "./components/MessageInput";
import Footer from "./components/Footer";
import BrandMark from "./components/BrandMark";

import "./index.scss";

const pubnub = new PubNub({
    publishKey: "pub-c-1155d113-d930-4355-a5ba-6acb71e919f4",
    subscribeKey: "sub-c-3d5f71dc-b01e-11ea-afa6-debb908608d9",
    uuid: "rich",
});

// TODO: Get channels from DB api
let channels = [
    { name: "Awesome Channel", id: "awesome-channel" },
    { name: "Fun Channel", id: "fun-channel" },
    { name: "Dance Channel", id: "dance-channel" },
];

const App = () => {
    const [messages, setMessages] = useState([
        "heyo",
        "how r u",
        "good today, you?",
    ]);
    const [message, setMessage] = useState("");
    const [currentChannel, setCurrentChannel] = useState(null);

    const sendMessage = (message) => {
        pubnub.publish(
            {
                channel: currentChannel.id,
                message,
            },
            (res) => {
                if (!res.error) {
                    setMessage("");
                    // TODO: Send this message to the MongoDB api
                }
            }
        );
    };

    const changeChannel = (channel) => {
        if (channel) {
            setMessage("");
            setCurrentChannel(channel);
            // TODO: Get message history from MongoDB api
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
            console.log(
                "Changing channel to: " +
                    channels.filter((channel) => channel.id == hash)[0].name
            );
        } else if (channels.length > 0) {
            changeChannel(channels[0]);
        } else {
            changeChannel(null);
        }
    }, []);

    return (
        <PubNubProvider client={pubnub}>
            <div className="App">
                <PubNubConsumer>
                    {(client) => {
                        client.addListener({
                            message: (messageEvent) => {
                                setMessages([
                                    ...messages,
                                    messageEvent.message,
                                ]);
                            },
                        });
                        client.subscribe(channels.map((channel) => channel.id));
                    }}
                </PubNubConsumer>
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
        </PubNubProvider>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
