export function getAllChannels() {
    return channelFetch("/api/channel");
}

export function postMessage(username, message, channel) {
    const url = "/api/channel/" + channel.url + "/messages";
    return channelFetch(url, {
        method: "POST",
        body: JSON.stringify({
            from: username,
            message: message,
            channelID: channel.id,
        }),
    });
}

export function getChannelMessages(channel) {
    const url = "/api/channel/" + channel.url + "/messages";
    return channelFetch(url);
}

export function createChannel(cUrl, cName) {
    const url = "/api/channel/";
    return channelFetch(url, {
        method: "POST",
        body: JSON.stringify({
            url: cUrl,
            name: cName,
        }),
    });
}

function channelFetch(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((res) => {
            if (res.ok) resolve(res.json());
            else
                reject(
                    new Error(
                        `Error fetching channel messages from ${url}: ` +
                            res.statusText
                    )
                );
        });
    });
}
