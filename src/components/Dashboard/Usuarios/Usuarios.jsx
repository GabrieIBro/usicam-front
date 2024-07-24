import React, {useEffect, useRef, useState} from "react";
import "./usuarios.scss"
import axiosInstance from "../../../../config/axios";
import images from "../../../assets/images/images";

import ModalSenha from "../ModalSenha/ModalSenha";
import Popup from "../Popup/Popup";

function Usuarios() {
    const [adicionarUsuarioOpen, setAdicionarUsuarioOpen] = useState(false);
    const [removerUsuarioOpen, setRemoverUsuarioOpen] = useState(false);
    const [alterarSenhaOpen, setAlterarSenhaOpen] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [usersToRemoveChecked, setUsersToRemoveChecked] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [refresh, setRefresh] = useState(0);

    function handleClickAdicionarUsuario() {
        setAdicionarUsuarioOpen(prev => !prev);
    }

    function handleClickRemoverUsuario() {
        setRemoverUsuarioOpen(prev => !prev);
    }

    function handleClickAlterarSenha() {
        setAlterarSenhaOpen(prev => !prev);
    }

    function handleChangeSearchInput(event) {
        setSearchTerm(event.target.value);
    }

    //Fetch user list

    useEffect(() => {
        axiosInstance.post('/usuarios', {searchTerm})
        .then(res => {
            setUsuarios(res.data);
            
        })
    }, [searchTerm, refresh]);

    //Set users checkboxes default values

    useEffect(() => {
        usuarios.forEach(item => {
            setUsersToRemoveChecked(prev => ({...prev, [item.id]:false}))
        })
    }, []);


    function handleCheckUsersToRemove(event) {
        const {name, id} = event.target
        setUsersToRemoveChecked(prev => ({...prev, [name || id]:!usersToRemoveChecked[name || id]}))
    } 

    let myRef = useRef();
    const [adicionarUsuarioValues, setAdicionarUsuarioValues] = useState({admin:0});
    const [alterarSenhaValues, setAlterarSenhaValues] = useState({});
    const [adicionarUsuarioErrors, setAdicionarUsuarioErrors] = useState({fullname: null, username: null, senhaUser: null});
    const [alterarSenhaErrors, setAlterarSenhaErrors] = useState({username: null, novaSenha: null});

    function handleChangeAdicionarUsuario(event) {
        const {name, value, checked} = event.target;
        let checkedInt;
        checkedInt = (checked) ? 1 : 0;

        setAdicionarUsuarioValues(prev => ({...prev, [name]: (name === 'admin') ? checkedInt : value}));
    }

    function handleChangeAlterarSenha(event) {
        const {name, value} = event.target;

        setAlterarSenhaValues(prev => ({...prev, [name]: value}));
    }


    function handleErrorsAdicionarUsuario(event) {
        const {name, value} = event.target;

        if(name === 'username') {
            const regex = /^[\w\-.]+$/g;
            const isValid = regex.test(value);

            if(value.length === 0) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Esse campo é obrigatório"}));
            }
            else if(value.length < 6) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Deve possuir ao menos 6 caracteres"}));
            }
            else if(value.length > 20) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Não deve possuir mais de 20 caracteres"}));
            }
            else if(!isValid){
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Caracteres especiais permitidos: - e ."}));
            }
            else {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:""}));
            }
        }
        else if(name === 'fullname') {
            const regex = /^[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F- ]+$/;
            const isValid = regex.test(value);

            if(value.length === 0) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Esse campo é obrigatório"}));
            }
            else if(value.length < 10) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Deve possuir ao menos 10 caracteres"}));
            }
            else if(value.length > 100) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Não deve possuir mais de 100 caracteres"}));
            }
            else if(!isValid){
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Utilize apenas caracteres alfabéticos"}));
            }
            else {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:""}));
            }
        }

        else if(name === 'senhaUser') {
            const regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
            const isNotValid = regex.test(value);

            if(value.length === 0) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Esse campo é obrigatório"}));
            }
            else if(value.length < 8) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Deve possuir ao menos 8 caracteres"}));
            }
            else if(value.length > 64) {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Não deve possuir mais de 64 caracteres"}));
            }
            else if(isNotValid){
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:"Deve possuir ao menos um caracter maiúsculo, especial e um número"}));
            }
            else {
                setAdicionarUsuarioErrors(prev => ({...prev, [name]:""}));
            }
        }
    }

    function handleErrorsAlterarSenha(event) {
        const {value, name} = event.target

        if(name === 'username') {

            if(value.length === 0) {
                setAlterarSenhaErrors(prev => ({...prev, [name]:"Esse campo é obrigatório"}));
            }
            else {
                setAlterarSenhaErrors(prev => ({...prev, [name]:""}));
            }
        }

        else if(name === 'novaSenha') {
            const regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;
            const isNotValid = regex.test(value);

            if(value.length === 0) {
                setAlterarSenhaErrors(prev => ({...prev, [name]:"Esse campo é obrigatório"}));
            }
            else if(value.length < 8) {
                setAlterarSenhaErrors(prev => ({...prev, [name]:"Deve possuir ao menos 8 caracteres"}));
            }
            else if(value.length > 64) {
                setAlterarSenhaErrors(prev => ({...prev, [name]:"Não deve possuir mais de 64 caracteres"}));
            }
            else if(isNotValid){
                setAlterarSenhaErrors(prev => ({...prev, [name]:"Deve possuir ao menos um caracter maiúsculo, especial e um número"}));
            }
            else {
                setAlterarSenhaErrors(prev => ({...prev, [name]:""}));
            }
        }
    }

    const [requestData, setRequestData] = useState({});
    const [modalParams, setModalParams] = useState({});
    const [requirePassword, setRequirePassword] = useState(+localStorage.getItem("requirePassword") <= Date.now());

    useEffect(() => {
        console.log("Require password: " + localStorage.getItem("requirePassword") <= Date.now());
        setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());

    }, [adicionarUsuarioValues, usersToRemoveChecked, alterarSenhaValues, refresh]);

    function clearValues() {
        const tempAlterarSenha = {...alterarSenhaValues};
        tempAlterarSenha.novaSenha = "";
        tempAlterarSenha.username = "";

        const tempAdicionarUser = {...adicionarUsuarioValues}
        tempAdicionarUser.fullname = "";
        tempAdicionarUser.username = "";
        tempAdicionarUser.senhaUser = "";
        tempAdicionarUser.admin = 0;

        setAdicionarUsuarioValues(tempAdicionarUser);
        setAlterarSenhaValues(tempAlterarSenha);
        setUsersToRemoveChecked({});
        setRequestData({});
        setModalParams({});
        setRefresh(prev => prev + 1);
    }

    async function handleSubmit(event) {
        const {name} = event.currentTarget;

        const adicionarUserErrorValues = Object.values(adicionarUsuarioErrors).filter(error => error !== "").length;
        const alterarSenhaErrorValues = Object.values(alterarSenhaErrors).filter(error => error !== "").length;
        
        const adicionarUser = Object.values(adicionarUsuarioValues).filter(value => value !== "").length;
        const alterarSenha = Object.values(alterarSenhaValues).filter(value => value !== "").length;

        let params;
        let data;

        console.log("Require Password: " + requirePassword);

        if(name === "adicionar-user") {
            params = {endpoint: "/adicionarUsuario", reqType: "POST"};
            data = {...adicionarUsuarioValues};
            setRequestData(adicionarUsuarioValues);

            if(adicionarUserErrorValues || adicionarUser === 1 && !displayModal) {
                event.preventDefault();
                return;
            }
        }
        if(name === "alterar-senha") {
            params = {endpoint: "/alterarSenhaUsuario", reqType: "PATCH"};
            data = {...alterarSenhaValues};
            setRequestData(alterarSenhaValues);

            if(alterarSenhaErrorValues || alterarSenha === 0 && !displayModal) {
                event.preventDefault();
                return;
            }
        }

        if(name === "remover-user") {
            params = {endpoint: "/removerUsuario", reqType: "DELETE"}
            const userArray = {ids: Object.keys(usersToRemoveChecked).filter(item => usersToRemoveChecked[item] === true)};

            data = userArray;
            setRequestData(userArray);

            const usersToRemoveValues = Object.values(usersToRemoveChecked);
            if(!usersToRemoveValues.includes(true)) {
                event.preventDefault();
                return;
            }
        }
        event.preventDefault();

        setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());

        if(requirePassword) {
            setDisplayModal(true);
            setModalParams(params);
            myRef.current.scrollIntoView({behavior: 'instant', block: 'end'});
            console.log(response);
        }
        else {
            await axiosInstance({
                url: params.endpoint,
                method: params.reqType,
                data
            })
            .then(res => {
                handlePopup(true, res.data);
                clearValues();
            })
            .catch(err => {
                handlePopup(false, err.response.data || err.message)
            })
        }
    }

    const [response, setResponse] = useState({});
    const [popupData, setPopupData] = useState({});
    const [timeouts, setTimeouts] = useState([]);

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
        if(response.status >= 400) {
            handlePopup(false, response.message);
        }
        else {
            handlePopup(true, response.message)
        }
    }, [response]);


    function RenderUsers() {
        return(
            usuarios.map((user, index) => (
                <div key={index} 
                    id={user.id} 
                    className={(usersToRemoveChecked[user.id]) ? "user-list__item" : ""}
                    onClick={event => handleCheckUsersToRemove(event)}>
                    <input type="checkbox" 
                            name={user.id} 
                            checked={usersToRemoveChecked[user.id]} 
                            onChange={event => handleCheckUsersToRemove(event)}/>
                    <p>{user.username}</p>
                    <p>{user.fullname}</p>
                </div>
            ))
        )
    }

    return(
        <div className={(displayModal) ? "usuarios-container-modal-active" : "usuarios-container"}>
            {requirePassword && 
            <ModalSenha open={displayModal} 
                        onClose={() => {
                            setDisplayModal(false);
                            setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());
                        }} 
                        onSuccess={clearValues}
                        response={setResponse}
                        data={requestData} 
                        params={modalParams}
                        />}

            {popupData?.message && <Popup success={popupData.success} message={popupData.message}/>}

            <div className={(adicionarUsuarioOpen) ? "adicionar-usuario-open" : "adicionar-usuario"} onClick={handleClickAdicionarUsuario} ref={myRef}>
                <div className="adicionar-usuario__label">
                    <p>Adicionar Usuário</p>
                </div>
                <div className={(adicionarUsuarioOpen) ? "adicionar-usuario__content-open" : "adicionar-usuario__content"} onClick={event => event.stopPropagation()}>
                    <form>
                        <div className="adicionar-usuario__input-fields">
                            <div>
                                <label htmlFor="fullname">Nome Completo</label>
                                <input type="text" 
                                        name="fullname" 
                                        maxLength={100}
                                        onBlur={event => handleErrorsAdicionarUsuario(event)}
                                        onChange={event => handleChangeAdicionarUsuario(event)}
                                        value={adicionarUsuarioValues.fullname}
                                        className={(adicionarUsuarioErrors.fullname) ? 'input-error' : ''}/>
                                <p>{adicionarUsuarioErrors.fullname}</p>
                            </div>

                            <div>
                                <label htmlFor="username">Usuário</label>
                                <input type="text" 
                                        name="username" 
                                        maxLength={20}
                                        onBlur={event => handleErrorsAdicionarUsuario(event)}
                                        onChange={event => handleChangeAdicionarUsuario(event)}
                                        value={adicionarUsuarioValues.username}
                                        className={(adicionarUsuarioErrors.username) ? 'input-error' : ''}/>
                                <p>{adicionarUsuarioErrors.username}</p>
                            </div>

                            <div>
                                <label htmlFor="senhaUser">Senha</label>
                                <input type="password" 
                                        name="senhaUser" 
                                        maxLength={64}
                                        onBlur={event => handleErrorsAdicionarUsuario(event)}
                                        onChange={event => handleChangeAdicionarUsuario(event)}
                                        value={adicionarUsuarioValues.senhaUser}
                                        className={(adicionarUsuarioErrors.senhaUser) ? 'input-error' : ''}/>
                                <p>{adicionarUsuarioErrors.senhaUser}</p>
                            </div>
                        </div>

                        <div className="admin-input">
                            <label htmlFor="admin">Admin</label>
                            <input type="checkbox" 
                                    name="admin"
                                    onChange={event => handleChangeAdicionarUsuario(event)}
                                    checked={adicionarUsuarioValues.admin}/>
                        </div>
                        <button name="adicionar-user" onClick={event => handleSubmit(event)}>Continuar</button>
                    </form>
                </div>
            </div>



            <div className={(removerUsuarioOpen) ? "remover-usuario-open" : "remover-usuario"} onClick={handleClickRemoverUsuario}>
                <div className="remover-usuario__label">
                    <p>Remover Usuário</p>
                </div>
                <div className={(removerUsuarioOpen) ? "remover-usuario__content-open" : "remover-usuario__content"} onClick={event => event.stopPropagation()}>
                    <div className="search-container">
                        <button className="remove-button" name="remover-user" onClick={event => handleSubmit(event)}> 
                            <img src={images.trash} alt="Trash logo" />
                        </button>
                        <input type="text" name="search" placeholder="Buscar Usuário" value={searchTerm} onChange={(event) => handleChangeSearchInput(event)}/>
                    </div>
                    <div className="user-list">
                        <RenderUsers/>
                    </div>
                </div>
            </div>



            <div className={(alterarSenhaOpen) ? "alterar-senha-open" : "alterar-senha"} onClick={handleClickAlterarSenha}>
                <div className="alterar-senha__label">
                    <p>Alterar Senhas</p>
                </div>
                <div className={(alterarSenhaOpen) ? "alterar-senha__content-open" : "alterar-senha__content"} onClick={event => event.stopPropagation()}>
                    <form>
                        <div className="alterar-senha__input-fields">
                            <div>
                                <label htmlFor="username">Usuário</label>
                                <input type="text"
                                        name="username" 
                                        maxLength={20}
                                        onBlur={event => handleErrorsAlterarSenha(event)}
                                        onChange={event => handleChangeAlterarSenha(event)}
                                        value={alterarSenhaValues.username}
                                        className={(alterarSenhaErrors.username) ? 'input-error' : ''}/>
                                <p>{alterarSenhaErrors.username}</p>
                            </div>
                            <div>
                                <label htmlFor="novaSenha">Nova Senha</label>
                                <input type="password" 
                                        name="novaSenha" 
                                        maxLength={64}
                                        onBlur={event => handleErrorsAlterarSenha(event)}
                                        onChange={event => handleChangeAlterarSenha(event)}
                                        value={alterarSenhaValues.novaSenha}
                                        className={(alterarSenhaErrors.novaSenha) ? 'input-error' : ''}/>
                                <p>{alterarSenhaErrors.novaSenha}</p>
                            </div>
                        </div>
                        <button name="alterar-senha" onClick={event => handleSubmit(event)}>Continuar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Usuarios;