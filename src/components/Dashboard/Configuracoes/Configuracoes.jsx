import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axios";
import "./configuracoes.scss";
import images from "../../../assets/images/images";

import Popup from "../Popup/Popup";
import Spinner from "../../Spinner/Spinner";

function Configuracoes() {
    const [profileImage, setProfileImage] = useState("");
    const [newProfileImage, setNewProfileImage] = useState("");
    const [alterarSenhaValues, setAlterarSenhaValues] = useState({});
    const [alterarSenhaError, setAlterarSenhaError] = useState("");

    const [popupData, setPopupData] = useState({});
    const [timeouts, setTimeouts] = useState([]);

    const [loading, setLoading] = useState({});

    function handlePopup(success, message) {

        if(timeouts.length > 0) {
            setPopupData({});

            timeouts.forEach(timer => {
                clearTimeout(timer);
            })
            setTimeouts([]);
        }
        setTimeout(() => {
            setPopupData({success, message});
            
            const timeout = setTimeout(() => {
                setPopupData({});
            }, 2500)
    
            setTimeouts(prev => ([...prev, timeout]));
        }, 50);
    }

    useEffect(() => {
        axiosInstance.get("/fotoPerfil")
        .then(res => {
            setProfileImage(res.data);
        })
    }, [])

    function handleChangeAlterarSenha(event) {
        const {name ,value} = event.target;

        if(name === "novaSenha") {
            if(value.length === 0) {
                setAlterarSenhaError("Esse campo é obrigatório");
            }
            else if(value.length < 8) {
                setAlterarSenhaError("A senha deve possuir pelo menos 8 caracteres");
            }
            else if(value.lenth > 64) {
                setAlterarSenhaError("A senha deve possuir no máximo 64 caracteres");
            }
            else if(!/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,64}$/.test(value)) {
                setAlterarSenhaError("A senha deve possuir ao menos um carácter maiúsculo, um número e um símbolo");
            }
            else {
                setAlterarSenhaError("");
            }
        }

        setAlterarSenhaValues(prev => ({...prev, [name]: value}));
    }

    function handleDrop(event) {
        const {files} = event.target;
        const filename = files[0].name.toLowerCase();
        console.log(files);

        if(files.length === 0) {
            return;
        }
        else if(files[0].size > 4194304) {
            handlePopup(false, "A imagem não pode exceder 4MB");
            return;
        }
        else if(!(filename.endsWith("jpg") || !filename.endsWith("svg") || !filename.endsWith("png") || !filename.endsWith("jpeg"))) {
            handlePopup(false, "Formato  de arquivo inválido");
            return;
        }

        setNewProfileImage(files[0]);
        setProfileImage(URL.createObjectURL(files[0]));
    }

    async function handleSubmit(event) {
        const {name} = event.target;
        let params;
        let data;

        if(name === "remover-imagem") {
            if(!profileImage) {
                return;
            }

            params = {reqType: "DELETE", endpoint: "/removerFotoPerfil"};
            setLoading({[name]:true})
        }
        else if(name === "alterar-imagem") {
            if(!newProfileImage) {
                return;
            }

            params = {endpoint: "/uploadFotoPerfil", reqType: "POST"};
            data = new FormData();
            data.append('fotoPerfil', newProfileImage);
            setLoading({[name]:true})

        }
        else if(name === "alterar-senha") {
            const values = Object.values(alterarSenhaValues);
            
            if(values.length === 2 && alterarSenhaError === "") {
                params = {endpoint: "/alterarSenhaUsuario", reqType: "PATCH"};
                data = {...alterarSenhaValues};
                setLoading({[name]:true})
            }
            else {
                return;
            }
        }

        await axiosInstance({
            url: params.endpoint,
            method: params.reqType,
            data
        })
        .then(res => {
            handlePopup(true, res.data);
            setLoading({});

            if(name === "alterar-senha") {
                setAlterarSenhaValues({});
                window.location.reload()
            }
            else if(name === "alterar-imagem") {
                localStorage.setItem("refresh", Date.now());
                const event = new StorageEvent('storage', {key: "refresh"});
                window.dispatchEvent(event);
            }
            else if(name === "remover-imagem") {
                localStorage.setItem("refresh", Date.now());
                setProfileImage("");
                setNewProfileImage("");
                const event = new StorageEvent('storage', {key: "refresh"});
                window.dispatchEvent(event);
            }
        })
        .catch(err => {
            handlePopup(false, err?.response.data || err.message);
        })
    }

    return(
        <div className="config-container">
            {popupData?.message && <Popup success={popupData.success} message={popupData.message}/>}

            <div className="config-container__alterar-foto">
                <p>Imagem do perfil</p>
                <div className="config-container__alterar-foto__content">
                    <div className="image-container">
                        <div className={(!profileImage) ? "no-profile-image" : ""}>
                            <img src={profileImage || images.userLogo} alt="Foto de perfil do usuário" draggable="false"/>
                        </div>
                        <input type="file" onChange={event => handleDrop(event)} allow="image/*"/>
                    </div>

                    <div className="actions-container">
                        <p>O tamanho da imagem não deve exceder 4MB. O formato deve ser JPG, SVG ou PNG.</p>
                        <div>
                            <button name="remover-imagem" 
                                    onClick={event => handleSubmit(event)}>
                                {loading["remover-imagem"] && <Spinner/>}
                                {!loading["remover-imagem"] && "Remover"}

                                
                            </button>

                            <button name="alterar-imagem" 
                                    onClick={event => handleSubmit(event)}>
                                {loading["alterar-imagem"] && <Spinner/>}
                                {!loading["alterar-imagem"] && "Alterar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="config-container__alterar-senha">
                <p>Alterar senha</p>
                <div className="config-container__alterar-senha__content">
                    <div className="input-container">
                        <div>
                            <label htmlFor="senha">Senha Atual</label>
                            <input type="password" 
                                    id="senha"
                                    value={alterarSenhaValues.senha}
                                    maxLength={64}
                                    name="senha"
                                    onChange={event => handleChangeAlterarSenha(event)}/>
                        </div>
                        <div>
                            <label htmlFor="senha-anterior">Nova Senha</label>                            
                            <input type="password" 
                                    id="senha-anterior"
                                    value={alterarSenhaValues.senhaAnterior}
                                    className={(alterarSenhaError) ? "input-error" : ""}
                                    maxLength={64}
                                    name="novaSenha"
                                    onChange={event => handleChangeAlterarSenha(event)}/>
                            <p>{alterarSenhaError}</p>
                        </div>
                    </div>
                    <button name="alterar-senha" onClick={event => handleSubmit(event)}>
                        {loading["alterar-senha"] && <Spinner/>}
                        {!loading["alterar-senha"] && "Avançar"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Configuracoes;