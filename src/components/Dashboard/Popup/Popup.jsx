import React from "react";
import images from "../../../assets/images/images";
import "./popup.scss";

function Popup(props) {
    const {success, message} = props;

    return(
        <div className="popup-container">
            <div className={(success) ? "popup-container__image-container-ok" : "popup-container__image-container-notok"}>
                <img src={(success) ? images.check : images.x} alt={(success) ? "Ok icon" : "Fail icon"}/>
            </div>
            <div className="popup-container__text-content">
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Popup;