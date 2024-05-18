import React from "react";
import "./footer.scss";
import { Link } from "react-router-dom";
import images from "../../assets/images/images";

function Footer() {
    const date = new Date;
    const year = date.getFullYear();

    return(
        <footer className="footer-container">
            <div className="footer">

                <div className="footer__info">
                    <div className="footer__info__site">
                        <p>Site</p>
                        <div className="footer__info__site__links">
                            <Link to="/">Login</Link>
                            <Link to="/servicos">Serviços</Link>
                            <Link to="/contato">Contato</Link>
                        </div>
                    </div>      
                            
                    <div className="footer__info__contato">
                        <p>Contatos</p>
                        <div className="footer__info__contato_content">
                            <p>(71)9 9641-6117</p>
                            <p>usicam.metal@gmail.com</p>
                            <p>Rua do Uruguai, 456a, Salvador-BA</p>
                        </div>
                    </div>       

                    <div className="footer__info__social">
                        <p>Redes Sociais</p>
                        <div className="footer__info__social__icons">
                            <img src={images.logoInstagram} draggable="false"></img>
                            <img src={images.logoFacebook} draggable="false"></img>
                        </div>
                    </div>                
                </div>
                <div className="footer__rights">
                    <p> © {year} USICAM. Todos os direitos reservados</p>
                </div>

            </div>
        </footer>
    )
}

export default Footer;