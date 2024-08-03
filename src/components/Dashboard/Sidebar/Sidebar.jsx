import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.scss";
import images from "../../../assets/images/images";
import axiosInstance from "../../../../config/axios";


function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    async function logout() {
        try {
            const result = await axiosInstance.post("/logout");
            if(result.status === 204) {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        function expand(e) {
            console.log(e);
            if(e.key === "expand-sidebar" || e.value === true) {
                setExpand(true)
            }
        }

        function collapse() {
            setExpand(false);
        }

        window.addEventListener("storage", expand);
        window.addEventListener("resize", collapse);


        return () => {
            window.removeEventListener("storage", expand);
            window.addEventListener("resize", collapse);
        }
    }, [])

    useEffect(() => {
        function collapseSidebar(e) {
            if(e.clientX > 275) {
                setExpand(false);
            }
        }

        window.addEventListener("click", collapseSidebar);

        return () => [
            window.removeEventListener("click", collapseSidebar)
        ]
    })

    return(
        <div className={(expand) ? "sidebar-expand" : "sidebar"}>
            <div className="sidebar__logo">
                <img src={images.logoUsicam} alt="USICAM logo" draggable="false" />
            </div>

            <div className="sidebar__options">
                <button name="inicio"
                        onClick={() => navigate('/dashboard/inicio')}
                        className={(location.pathname === "/dashboard/inicio") ? "active-button" : ""}
                >
                    <img src={images.homeLogo} alt="Home logo" className="home-logo"/>
                    <p>Início</p>
                </button>

                <button name="mensagens"
                        onClick={() => navigate('/dashboard/mensagens')}
                        className={(location.pathname === "/dashboard/mensagens") ? "active-button" : ""}
                >
                    <img src={images.inboxLogo} alt="Inbox logo" />
                    <p>Mensagens</p>
                </button>

                <button name="pedidos"
                        onClick={() => navigate('/dashboard/pedidos')}
                        className={(location.pathname === "/dashboard/pedidos") ? "active-button" : ""}

                >
                    <img src={images.pedidosLogo} alt="Pedidos logo" />
                    <p>Pedidos</p>
                </button>

                <button name="publico"
                        onClick={() => navigate('/dashboard/publico')}
                        className={(location.pathname === "/dashboard/publico") ? "active-button" : ""}

                >
                    <img src={images.globe} alt="Público logo" />
                    <p>Público</p>
                </button>

                <button name="usuarios"
                        onClick={() => navigate('/dashboard/usuarios')}
                        className={(location.pathname === "/dashboard/usuarios") ? "active-button" : ""}

                >
                    <img src={images.usuariosLogo} alt="User logo" className="usuario-logo"/>
                    <p>Usuários</p>
                </button>
                
                <button name="configuracoes"
                        onClick={() => navigate('/dashboard/configuracoes')}
                        className={(location.pathname === "/dashboard/configuracoes") ? "active-button" : ""}

                >
                    <img src={images.configLogo} alt="Config logo" />
                    <p>Configurações</p>
                </button>

                <button className="sair" onClick={logout}>
                    <img src={images.signOutLogo} alt="Sign out logo" />
                    <p>Sair</p>
                </button>
            </div>

        </div>
    )
}

export default Sidebar;