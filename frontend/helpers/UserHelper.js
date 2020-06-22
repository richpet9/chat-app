export function createUser(username) {
    const url = "/api/user";
    return userFetch(url, {
        method: "POST",
        body: JSON.stringify({ username: username }),
    });
}

export function changeUsername(username, newUsername) {
    const url = "/api/user/" + username;
    return userFetch(url, {
        method: "POST",
        body: JSON.stringify({ newUsername: newUsername }),
    });
}

function userFetch(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options).then((res) => {
            if (res.ok) resolve(res.json());
            else
                reject(
                    new Error(
                        `Error fetching user info from ${url}: ` +
                            res.statusText
                    )
                );
        });
    });
}
