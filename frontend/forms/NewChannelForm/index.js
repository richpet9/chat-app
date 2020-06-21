import React, { useState, useRef } from "react";
import FAInput from "../../components/FAInput";
import "./index.scss";

const NewChannelForm = (props) => {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const inputs = {
        url: useRef(),
        name: useRef(),
    };

    const validateUrl = (str) => {
        const invalidChars = str.match(/[^a-zA-Z0-9-]/g);
        if (str.length < 3 || (invalidChars && invalidChars.length > 0)) {
            return false;
        }

        return true;
    };

    const validateName = (str) => {
        if (str.length < 3 || str.length > 256) {
            return false;
        }

        return true;
    };

    const checkInputs = () => {
        for (let i = 0; i < Object.keys(inputs).length; i++) {
            const input = inputs[Object.keys(inputs)[i]].current;
            if (
                input.value.length == 0 ||
                input.className.includes("invalid")
            ) {
                setSubmitDisabled(true);
                break;
            }
        }
    };

    return (
        <form
            className="new-channel form"
            action={"#" + (inputs.url.current ? inputs.url.current.value : "")}
            onChange={checkInputs}
        >
            <div className="form-name">Create Channel</div>

            <label htmlFor="url" className="text">
                URL
            </label>
            <FAInput
                placeholder="brand-new-channel"
                id="url"
                FAIcon="fa-link"
                validate={validateUrl}
                ref={inputs.url}
            />

            <label htmlFor="name" className="text">
                Name
            </label>
            <FAInput
                placeholder="Brand New Channel"
                id="name"
                FAIcon="fa-hashtag"
                validate={validateName}
                ref={inputs.name}
            />

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
