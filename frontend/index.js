import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PubNub from "pubnub";
import { PubNubProvider, usePubNub } from "pubnub-react";
import Channels from "./components/Channels";
import ChannelInfo from "./components/ChannelInfo";
import MessagesBox from "./components/MessagesBox";
import MessageInput from "./components/MessageInput";
import BrandMark from "./components/BrandMark";
import FloatingWindow from "./components/FloatingWindow";
import PageHide from "./components/PageHide";
import UserControl from "./components/UserControl";
import NewChannelForm from "./forms/NewChannelForm";
import CreateUsernameForm from "./forms/CreateUsernameForm";
import ChangeUsernameForm from "./forms/ChangeUsernameForm";
import {
    getAllChannels,
    postMessage,
    getChannelMessages,
} from "./helpers/ChannelHelper";
import { createUser, changeUsername, getUser } from "./helpers/UserHelper";
import "./index.scss";

const pubnub = new PubNub({
    publishKey: "pub-c-40ab95dd-4ce4-4968-86a4-39fa28f1c3b5",
    subscribeKey: "sub-c-7baebe72-b0b7-11ea-af7b-9a67fd50bac3",
    uuid: "unnamed user",
});

const App = () => {
    const pubnub = usePubNub();
    const [username, setUsername] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [channels, setChannels] = useState(null);
    const [fwShow, setFwShow] = useState(null);
    const fwRef = useRef();

    const onCreateUsername = ({ username }) => {
        setUsername(username.current.value);
        pubnub.setUUID(username.current.value);
        setFwShow(null);
    };

    const onNewChannel = ({ id, name, url }) => {
        changeChannel({
            id: id,
            name: name.current.value,
            url: url.current.value,
        });
        setFwShow(null);
    };

    // Log out the current user
    const logoutUser = () => {
        localStorage.clear("username");
        setUsername(null);
        setFwShow(<CreateUsernameForm submitHook={onCreateUsername} />);
    };

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
                    postMessage(
                        pubnub.getUUID(),
                        message,
                        currentChannel,
                        response.timetoken / 10000
                    );
                }
            }
        );
    };

    // Change channel function
    const changeChannel = (channel) => {
        // If we are changing to a channel (not null)
        if (channel) {
            // Set the current channel to what we wanted
            setCurrentChannel(channel);
            // Get the message history from the API
            getChannelMessages(channel).then((messages) => {
                // Set the messages to the message history
                setMessages(messages);
                //TODO: this is an uncaught promise
            });
            window.location.hash = channel.url;
        } else {
            // When we are changing to a null channel
            setCurrentChannel(null);
            setMessages([]);
            setFwShow(<NewChannelForm submitHook={onNewChannel} />);
        }
    };

    // The first side effect: when we mount up, check if we are logged in / have a username stored locally
    useEffect(() => {
        if (!username) {
            getUser(localStorage.getItem("username"))
                .then((user) => {
                    setUsername(user.username);
                    pubnub.setUUID(user.username);
                })
                .catch((e) => {
                    localStorage.clear("username");
                    setFwShow(
                        <CreateUsernameForm submitHook={onCreateUsername} />
                    );
                });
        }
        // When this component unmounts, unsub from all the channels
        return () => pubnub.unsubscribeAll();
    }, []);

    // This can be done better-- but rebuild the messages function w new messages
    useEffect(() => {
        pubnub.addListener({
            message: (messageEvent) => {
                setMessages([
                    ...messages,
                    {
                        from: messageEvent.publisher,
                        message: messageEvent.message,
                        timeToken: messageEvent.timetoken / 10000,
                    },
                ]);
            },
        });
    }, [messages]);

    // // Subscribe to new channels as they come
    useEffect(() => {
        // If we have channels, subscribe to all of them on pubnub
        if (channels) {
            pubnub.subscribe({
                channels: channels.map((channel) => channel.url),
            });
        }
    }, [channels]);

    // If we don't have a current channel, set it based on URL
    useEffect(() => {
        // If we don't have a current channel but we do have some channels available
        if (!currentChannel && channels) {
            const hash = window.location.hash.substring(1);
            if (channels.map((channel) => channel.url).includes(hash)) {
                changeChannel(
                    channels.filter((channel) => channel.url == hash)[0]
                );
            } else if (channels.length > 0) {
                changeChannel(channels[0]);
            }
        }
    }, [channels]);

    // // Fetch Channels side effect
    useEffect(() => {
        // Get all the channels when the app first mounts
        getAllChannels()
            .then((channels) => {
                setChannels(channels);
            })
            .catch((error) => console.warn(error));
    }, [currentChannel]);

    return (
        <div className="App">
            <FloatingWindow show={fwShow} ref={fwRef} forceShow={!username} />

            <PageHide show={!username} />

            <div className="left-side-panel">
                <BrandMark />
                <Channels
                    channels={channels}
                    currentChannel={currentChannel} // TODO: move channel state to channels component
                    changeChannel={changeChannel}
                    openNewChannelForm={() => {
                        setFwShow(<NewChannelForm submitHook={onNewChannel} />);
                    }}
                />
                <UserControl
                    username={username}
                    openChangeUsernameForm={() => {
                        setFwShow(
                            <ChangeUsernameForm
                                username={username}
                                submitHook={onCreateUsername}
                            />
                        );
                    }}
                    logoutUser={logoutUser}
                />
            </div>

            <div className="center-panel">
                <ChannelInfo channel={currentChannel} />
                <MessagesBox messages={messages} />
                <MessageInput sendMessage={sendMessage} />
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
