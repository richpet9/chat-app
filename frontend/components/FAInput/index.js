import React, { useState, forwardRef } from "react";
import "./index.scss";

const FAInput = forwardRef(({ id, placeholder, FAIcon, validate }, ref) => {
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(true);
    const [error, setError] = useState(null);

    const validator = (str) => {
        validate(str)
            .then((success) => {
                setValid(true);
                setError(null);
            })
            .catch((error) => {
                setValid(false);
                setError(error);
            });

        setValue(str);
    };

    return (
        <div className="input-icon-container">
            {
                <div className={"error-msg " + (error ? "" : "hidden")}>
                    {error}
                </div>
            }
            <input
                type="text"
                placeholder={placeholder}
                id={id}
                value={value}
                onChange={(e) => validator(e.target.value)}
                className={valid ? "valid" : "invalid"}
                ref={ref}
            />
            <span className={"fas " + FAIcon} />
        </div>
    );
});

export default FAInput;
