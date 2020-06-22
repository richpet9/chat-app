import React, { useState, useRef, useEffect } from "react";
import FAInput from "../../components/FAInput";
import { createChannel } from "../../helpers/ChannelHelper";
import "../index.scss";

const NewChannelForm = (props) => {
    const [urlValid, setUrlValid] = useState(false);
    const [nameValid, setNameValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const inputs = {
        url: useRef(),
        name: useRef(),
    };

    // URL validation function
    const validateUrl = (str) => {
        const invalidChars = str.match(/[^a-zA-Z0-9-]/g);
        if (str.length < 3 || (invalidChars && invalidChars.length > 0)) {
            setUrlValid(false);
            return false;
        }

        setUrlValid(true);
        return true;
    };

    // Name validation function
    const validateName = (str) => {
        if (str.length < 3 || str.length > 256) {
            setNameValid(false);
            return false;
        }

        setNameValid(true);
        return true;
    };

    const submitForm = () => {
        if (formValid) {
            createChannel(
                inputs.url.current.value,
                inputs.name.current.value
            ).then((res) => props.changeChannel(res));
        }
    };

    // Side effect: when the validity of our inputs changes, check the validity of the form
    useEffect(() => {
        if (nameValid && urlValid) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [urlValid, nameValid]);

    return (
        <form
            className="new-channel form"
            action={"#" + (inputs.url.current ? inputs.url.current.value : "")}
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
                value="CREATE CHANNEL"
                disabled={!formValid}
                onClick={submitForm}
            />
        </form>
    );
};

export default NewChannelForm;
