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
import { createUser } from "./helpers/UserHelper";
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
    const [floatingWindow, setFloatingWindow] = useState(false);
    const [floatingWindowContent, setFloatingWindowContent] = useState("");
    const fwRef = useRef();

    // Create a username
    const createUsername = (str) => {
        createUser(str)
            .then((res) => {
                pubnub.setUUID(str);
                setUsername(str);
                setFloatingWindow(false);
                localStorage.setItem("username", str);
            })
            .catch((e) => {
                console.warn("Error when registering user with database: " + e);
            });
    };

    // Log out the current user
    const logoutUser = () => {
        localStorage.clear("username");
        setUsername(null);
        setFloatingWindowContent(
            <CreateUsernameForm createUsername={createUsername} />
        );
        setFloatingWindow(true);
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

    // Toggle the floating window open and closed
    const toggleFloatingWindow = () => {
        setFloatingWindow(!floatingWindow);
    };

    // The first side effect: when we mount up, check if we are logged in / have a username stored locally
    useEffect(() => {
        if (!username) {
            if (!localStorage.getItem("username")) {
                setFloatingWindowContent(
                    <CreateUsernameForm createUsername={createUsername} />
                );
                setFloatingWindow(true);
            } else {
                setUsername(localStorage.getItem("username"));
            }
        }
    }, []);

    // Side effect: whenever we open or close the floating window, bind listeners
    useEffect(() => {
        // Callback function for when we click w floating window open
        const handleClicks = (e) => {
            // If we clicked outisde the floating window
            if (fwRef.current && !fwRef.current.contains(e.target)) {
                // Hide the window and remove the
                setFloatingWindow(false);
                document.removeEventListener("click", handleClicks);
            }
        };

        if (!floatingWindow) {
            document.removeEventListener("click", handleClicks);
        } else {
            // Bind the click-anywhere-and-close event if there is a username
            if (username) {
                document.addEventListener("click", handleClicks);
            }
        }
    }, [floatingWindow]);

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
        // When this component unmounts, unsub from all the channels
        return () => pubnub.unsubscribeAll();
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
            <FloatingWindow show={floatingWindow} ref={fwRef}>
                {floatingWindowContent}
            </FloatingWindow>

            <PageHide show={!username} />

            <div className="left-side-panel">
                <BrandMark />
                <Channels
                    channels={channels}
                    currentChannel={currentChannel} // TODO: move channel state to channels component
                    changeChannel={changeChannel}
                    openNewChannelForm={() => {
                        setFloatingWindowContent(
                            <NewChannelForm
                                changeChannel={(channel) => {
                                    setFloatingWindow(false);
                                    changeChannel(channel);
                                }}
                            />
                        );
                        toggleFloatingWindow();
                    }}
                />
                <UserControl
                    username={username}
                    openChangeUsernameForm={() => {
                        setFloatingWindowContent(
                            <ChangeUsernameForm username={username} />
                        );
                        toggleFloatingWindow();
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
