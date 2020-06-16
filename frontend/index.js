import React, { useState } from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider, PubNubConsumer } from "pubnub-react";
import Channels from "./components/Channels";
import ChannelInfo from "./components/ChannelInfo";
import MessagesBox from "./components/MessagesBox";
import MessageInput from "./components/MessageInput";

import "./index.scss";

const pubnub = new PubNub({
    publishKey: "pub-c-1155d113-d930-4355-a5ba-6acb71e919f4",
    subscribeKey: "sub-c-3d5f71dc-b01e-11ea-afa6-debb908608d9",
    uuid: "rich",
});

// TODO: Get channels from DB api
const channels = ["awesomeChannel", "funchannel", "dancingchannel"];

const App = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentChannel, setCurrentChannel] = useState(channels[0]);

    const sendMessage = (message) => {
        pubnub.publish(
            {
                channel: currentChannel,
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
        setMessage("");
        setCurrentChannel(channel);
        // TODO: Get message history from MongoDB api
        setMessages([]);
    };

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
                        client.subscribe({ channels });
                    }}
                </PubNubConsumer>
                <div className="left-side-panel">
                    <Channels
                        channels={channels}
                        changeChannel={changeChannel}
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
