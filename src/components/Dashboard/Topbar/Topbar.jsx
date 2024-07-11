import React, { useEffect, useState } from "react";
import images from "../../../assets/images/images";
import "./topbar.scss";
import axiosInstance from "../../../../config/axios";

function Topbar(props) {
    const [fotoPerfil, setFotoPerfil] = useState();

    useEffect(() => {
        axiosInstance.get("/fotoPerfil")
        .then(res => {
            setFotoPerfil(res.data);
        })
    }, []);

    return(
        <div className="topbar">
            <input type="checkbox" className="mode-toggle"/>

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