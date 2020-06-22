import React, { useState, useRef, useEffect } from "react";
import FAInput from "../../components/FAInput";

const CreateUsername = (props) => {
    const [usernameValid, setUsernameValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const inputs = {
        username: useRef(),
    };

    // Name validation function
    const validateUsername = (str) => {
        if (str.length < 3 || str.length > 256) {
            setUsernameValid(false);
            return false;
        }

        setUsernameValid(true);
        return true;
    };

    const submitForm = () => {
        if (formValid) {
            props.createUsername(inputs.username.current.value);
        }
    };

    // Side effect: when the validity of our inputs changes, check the validity of the form
    useEffect(() => {
        if (usernameValid) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [usernameValid]);

    return (
        <form className="create-username form" action="#">
            <div className="form-name">Create Username</div>

            <label htmlFor="url" className="text">
                Username
            </label>
            <FAInput
                placeholder="Keanu"
                id="url"
                FAIcon="fa-user"
                validate={validateUsername}
                ref={inputs.username}
            />

            <input
                type="submit"
                id="name"
                value="CONTINUE"
                disabled={!formValid}
                onClick={submitForm}
            />
        </form>
    );
};

export default CreateUsername;
