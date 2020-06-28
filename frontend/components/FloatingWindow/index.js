import React, { useState, useEffect, forwardRef } from "react";

import "./index.scss";

const FloatingWindow = forwardRef((props, ref) => {
    const [left, setLeft] = useState(0);
    const [zIndex, setzIndex] = useState(10);
    const [shouldShow, setShouldShow] = useState(false);
    const [int, setInt] = useState(null);

    useEffect(() => {
        if (props.show) {
            setShouldShow(true);
        } else {
            setShouldShow(false);
        }
    }, [props.show]);

    useEffect(() => {
        if (int) {
            clearTimeout(int);
        }

        if (shouldShow) {
            setLeft(window.innerWidth / 2 - ref.current.clientWidth / 2);
            setzIndex(10);
            document.addEventListener("click", handleClicks);
        } else {
            setInt(setTimeout(() => setzIndex(-999), 150));
            document.removeEventListener("click", handleClicks);
        }
    }, [shouldShow]);

    // Callback function for when we click w floating window open
    const handleClicks = (e) => {
        // If we clicked outisde the floating window
        if (
            !props.forceShow &&
            ref.current &&
            !ref.current.contains(e.target)
        ) {
            // Hide the window
            setShouldShow(false);
            document.removeEventListener("click", handleClicks);
        }
    };

    return (
        <div
            ref={ref}
            className={"floating-window " + (shouldShow ? "" : "hidden")}
            style={{ left: left, zIndex: zIndex }}
        >
            {props.show}
        </div>
    );
});

export default FloatingWindow;
