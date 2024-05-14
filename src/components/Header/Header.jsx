import React from "react";
import { Link } from "react-router-dom";
import "./header.scss"
import images from "../../assets/images/images"

function Header() {
    return(
        <div className="header-container">
            <header className="header">
                <div className="header__image-container">
                    <img src={images.logoUsicam} draggable="false"></img>
                </div>
                <nav className="navbar">
                    <div className="navbar__items">
                        <Link to="/" draggable="false">Início</Link>
                        <Link to="/servicos" draggable="false">Serviços</Link>
                        <Link to="/contato" draggable="false">Contato</Link>
                    </div>
                    <button className="navbar__button">Entrar</button>
                </nav>
            </header>
        </div>
    )
}

export default Header;