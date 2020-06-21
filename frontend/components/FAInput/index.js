import React, { useState, forwardRef } from "react";
import "./index.scss";

const FAInput = forwardRef(({ id, placeholder, FAIcon, validate }, ref) => {
    const [value, setValue] = useState("");
    const [valid, setValid] = useState(true);

    const validator = (str) => {
        if (validate(str)) {
            setValid(true);
        } else {
            setValid(false);
        }
        setValue(str);
    };

    return (
        <div className="input-icon-container">
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
