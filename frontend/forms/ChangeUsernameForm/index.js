import React, { useState, useRef, useEffect } from "react";
import FAInput from "../../components/FAInput";
import { getUser, changeUsername } from "../../helpers/UserHelper";
import { isProfane } from "../../helpers/WordFilter";

const ChangeUsernameForm = (props) => {
    const [usernameValid, setUsernameValid] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const inputs = {
        username: useRef(),
    };

    // Name validation function
    const validateUsername = (str) => {
        return new Promise((resolve, reject) => {
            if (str.length == 0) {
                reject("Username is required.");
                setUsernameValid(false);
            } else {
                getUser(str)
                    .then((user) => {
                        // This username is taken
                        setUsernameValid(false);
                        reject("Username is taken.");
                    })
                    .catch((e) => {
                        // Username is available
                        // Check length requirements
                        if (str.length < 3 || str.length > 256) {
                            setUsernameValid(false);
                            reject(
                                "Username must be longer than 3 characters and less than 256."
                            );
                        } else if (isProfane(str)) {
                            // Username contains profanity
                            setUsernameValid(false);
                            reject("Username cannot contain profanity.");
                        } else {
                            // If length is not an issue, return good
                            setUsernameValid(true);
                            resolve(true);
                        }
                    });
            }
        });
    };

    const submitForm = (e) => {
        e.preventDefault();

        if (formValid) {
            const str = inputs.username.current.value;
            changeUsername(props.username, str)
                .then(() => {
                    localStorage.setItem("username", str);
                    props.submitHook(inputs);
                })
                .catch((e) => {
                    console.warn("Error when changing sername: " + e);
                });
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
        <form className="change-username form">
            <div className="form-name">Change Username</div>

            <label htmlFor="url" className="text">
                New Username
            </label>
            <FAInput
                placeholder={props.username}
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
                onClick={(e) => submitForm(e)}
            />
        </form>
    );
};

export default ChangeUsernameForm;
