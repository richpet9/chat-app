import React, { useEffect, useState } from "react";
import "./index.scss";

const PageHide = ({ show }) => {
    const [shouldShow, setShouldShow] = useState(show);
    const [styles, setStyles] = useState();
    const [to, setTo] = useState(null);

    useEffect(() => {
        // If there is already a timeout function running, clear it
        if (to) {
            clearTimeout(to);
        }

        // If the parent wants to show this element
        if (show) {
            setShouldShow(true);
            setStyles({ opacity: 1 });
        } else {
            // The parent wants this element to hide
            setStyles({ opacity: 0 });
            setTo(
                setTimeout(() => {
                    setStyles({ ...styles, zIndex: -999 });
                    setShouldShow(false);
                }, 200)
            );
        }
    }, [show]);

    return shouldShow && <div className="page-hide" style={styles}></div>;
};

export default PageHide;
