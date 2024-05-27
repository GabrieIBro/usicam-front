import React from "react";
import images from "../../../assets/images/images";
import "./topbar.scss";

function Topbar(props) {
    return(
        <div className="topbar">
            <input type="checkbox" className="mode-toggle"/>

            <div className="topbar__user">
                <div className="topbar__user__image-container">
                    <img src={images.userLogo} alt="User logo" draggable="false"/>
                </div>
                <p>{props.username}</p>
            </div>
        </div>
    )
}

export  default Topbar;