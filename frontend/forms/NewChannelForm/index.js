import React, { useRef, useState } from "react";
import "./index.scss";

const NewChannelForm = (props) => {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");

    const validateUrl = (str) => {
        const invalidChars = str.match(/[^a-zA-Z0-9-]/g);
        if (str.length <= 2 || (invalidChars && invalidChars.length > 0)) {
            setSubmitDisabled(true);
        } else if (str.length > 2) {
            setSubmitDisabled(false);
        }
        setUrl(str);
    };

    return (
        <form className="new-channel form">
            <div className="form-name">Create Channel</div>

            <label htmlFor="url" className="text">
                URL
            </label>
            <div className="input-icon-container">
                <input
                    type="text"
                    placeholder="brand-new-channel"
                    id="url"
                    value={url}
                    onChange={(e) => validateUrl(e.target.value)}
                />
                <span className="fas fa-link" />
            </div>

            <label htmlFor="name" className="text">
                Name
            </label>
            <div className="input-icon-container">
                <input
                    type="text"
                    placeholder="Brand New Channel"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <span className="fas fa-hashtag" />
            </div>

            <input
                type="submit"
                id="name"
                value="CREATE CHANNEL"
                disabled={submitDisabled}
            />
        </form>
    );
};

export default NewChannelForm;
