import React from "react";
import "./index.scss";

const UserControl = ({ username, openChangeUsernameForm, logoutUser }) => {
    return (
        username && (
            <div className="user-container">
                <button
                    className="username-button"
                    onClick={openChangeUsernameForm}
                >
                    <i className="fas fa-user"></i>
                    <span>{username}</span>
                </button>
                <button className="username-button" onClick={logoutUser}>
                    <i className="fa fa-sign-out"></i>
                    <span>Logout</span>
                </button>
            </div>
        )
    );
};

export default UserControl;
