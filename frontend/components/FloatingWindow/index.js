import React, { useState, useEffect, forwardRef } from "react";

import "./index.scss";

const FloatingWindow = forwardRef((props, ref) => {
    const [left, setLeft] = useState(0);
    const [zIndex, setzIndex] = useState(10);
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        if (props.show) {
            setLeft(window.innerWidth / 2 - ref.current.clientWidth / 2);
            setzIndex(10);
            setShouldShow(true);
        } else {
            setShouldShow(false);
            setTimeout(() => setzIndex(-999), 150);
        }
    }, [props.show]);

    return (
        <div
            ref={ref}
            className={"floating-window " + (shouldShow ? "" : "hidden")}
            style={{ left: left, zIndex: zIndex }}
        >
            {props.children}
        </div>
    );
});

export default FloatingWindow;
