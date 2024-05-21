import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./header.scss"
import images from "../../assets/images/images"

function Header() {
    const [openNavbar, setOpenNavbar] = useState(false);

    function handleNavbarToggle() {
        setOpenNavbar((prev) => !prev);
    }

    return(
        <div className="header-container">
            <header className="header">
                <div className="header__image-container">
                    <img src={images.logoUsicam} draggable="false"></img>
                </div>
                <nav className={(openNavbar) ? "navbar open-navbar" : "navbar closed-navbar"}>
                    <div className="navbar__items">
                        <Link to="/" draggable="false">Início</Link>
                        <Link to="/servicos" draggable="false">Serviços</Link>
                        <Link to="/contato" draggable="false">Contato</Link>
                    </div>
                    <button className="navbar__button">Entrar</button>
                </nav>

                <div className="toggle-navbar" onClick={handleNavbarToggle}>
                    <div className={(openNavbar) ? "toggle-navbar__bar bar-1-open" : "toggle-navbar__bar bar-1"}></div>
                    <div className={(openNavbar) ? "" : "toggle-navbar__bar bar-2"}></div>
                    <div className={(openNavbar) ? "toggle-navbar__bar bar-3-open" : "toggle-navbar__bar bar-3"}></div>
                </div>
            </header>
        </div>
    )
}

export default Header;