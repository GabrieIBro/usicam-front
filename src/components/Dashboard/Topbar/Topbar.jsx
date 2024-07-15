import React, { useEffect, useState } from "react";
import images from "../../../assets/images/images";
import "./topbar.scss";
import axiosInstance from "../../../../config/axios";

function Topbar(props) {
    const [fotoPerfil, setFotoPerfil] = useState();
    const [darkMode, setDarkMode] = useState(false);

    function handleClickDarkMode() {
        setDarkMode(prev => !prev);
    }

    useEffect(() => {
        axiosInstance.get("/fotoPerfil")
        .then(res => {
            setFotoPerfil(res.data);
        })
    }, []);

    return(
        <div className="topbar">

            <div className={(darkMode) ? "mode-toggle-dark" : "mode-toggle-light"} onClick={handleClickDarkMode}>
                <div>
                    <img src={images.moon} draggable="false"></img>
                    <img src={images.sun} draggable="false"></img>
                </div>
            </div>

            <div className="topbar__user">
                <div className="topbar__user__image-container">
                    {!fotoPerfil && <img src={images.userLogo} alt="User logo" draggable="false" className="default-image"/>}
                    {fotoPerfil && <img src={fotoPerfil} alt="User images" draggable="false" className="user-image"/>}
                </div>
                <p>{props.username}</p>
            </div>
        </div>
    )
}

export  default Topbar;