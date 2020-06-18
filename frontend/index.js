import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";
import Channels from "./components/Channels";
import ChannelInfo from "./components/ChannelInfo";
import MessagesBox from "./components/MessagesBox";
import MessageInput from "./components/MessageInput";
import BrandMark from "./components/BrandMark";
import {
    getAllChannels,
    postMessage,
    getChannelMessages,
} from "./helpers/ChannelHelper";

import "./index.scss";

const pubnub = new PubNub({
    publishKey: "pub-c-40ab95dd-4ce4-4968-86a4-39fa28f1c3b5",
    subscribeKey: "sub-c-7baebe72-b0b7-11ea-af7b-9a67fd50bac3",
    uuid: "test-user",
});

const App = () => {
    const pubnub = usePubNub();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [currentChannel, setCurrentChannel] = useState(null);
    const [channels, setChannels] = useState(null);

    // Send message function, everytime we press enter / hit send
    const sendMessage = (message) => {
        // Publish the message to pubnub
        pubnub.publish(
            {
                channel: currentChannel.url,
                message,
            },
            (status, response) => {
                // If pubnub recieves it, publish to the database using the API
                if (!status.error) {
                    // I'm sure this is overkill, since pubnub can store history, but using Sails.js
                    // for the first time made it very difficult to figure out how to implement pubnub
                    // effeciently on the back-end, so instead we just store our own history with the channel
                    // and user configs.
                    postMessage("text-user", message, currentChannel);

                    // Set the message input bar to blank
                    setMessage("");
                }
            }
        );
    };

    // Change channel function
    const changeChannel = (channel) => {
        // If we are changing to a channel (not null)
        if (channel) {
            // Set the message input to nothing
            setMessage("");
            // Set the current channel to what we wanted
            setCurrentChannel(channel);
            // Get the message history from the API
            getChannelMessages(channel).then((messages) =>
                // Set the messages to the message history
                setMessages(messages)
            );
            window.location.hash = channel.url;
        } else {
            // When we are changing to a null channel
            setCurrentChannel(null);
            setMessages([]);
        }
    };

    // Whenever the channel list changes, if we don't have a current channel, set it based on URL
    useEffect(() => {
        // If we don't have a current channel but we do have some channels available
        if (!currentChannel && channels) {
            const hash = window.location.hash;
            if (channels.map((channel) => channel.url).includes(hash)) {
                changeChannel(
                    channels.filter((channel) => channel.url == hash)[0]
                );
            } else if (channels.length > 0) {
                changeChannel(channels[0]);
            }
        }
    }, [channels]);

    // This can be done better-- but rebuild the messages function w new messages
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

    // Subscribe to new channels as they come
    useEffect(() => {
        // If we have channels, subscribe to all of them on pubnub
        if (channels) {
            pubnub.subscribe({
                channels: channels.map((channel) => channel.url),
            });
        }
        // When this component unmounts, unsub from all the channels
        return () => pubnub.unsubscribeAll();
    }, [channels]);

    // Fetch Channels side effect
    useEffect(() => {
        // Get all the channels when the app first mounts
        getAllChannels()
            .then((channels) => {
                setChannels(channels);
            })
            .catch((error) => console.warn(error));
    }, []);

    return (
        <div className="App">
            <div className="left-side-panel">
                <BrandMark />
                <Channels
                    channels={channels}
                    currentChannel={currentChannel} // TODO: move channel state to channels component
                    changeChannel={changeChannel}
                    placeholder={channels == null}
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
