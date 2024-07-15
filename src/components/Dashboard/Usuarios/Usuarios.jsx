import React, {useEffect, useRef, useState} from "react";
import "./usuarios.scss"
import axiosInstance from "../../../../config/axios";
import images from "../../../assets/images/images";

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
    const [usuarioOption, setUsuarioOption] = useState('');
    const [adicionarUsuarioValues, setAdicionarUsuarioValues] = useState({admin:0});
    const [alterarSenhaValues, setAlterarSenhaValues] = useState({});
    const [adicionarUsuarioErrors, setAdicionarUsuarioErrors] = useState({fullname: null, username: null, senhaUser: null});
    const [alterarSenhaErrors, setAlterarSenhaErrors] = useState({username: null, novaSenha: null});
    const [adminPassword, setAdminPassword] = useState('');

    function handleModal(event) {
        const {name} = event.currentTarget;

        const adicionarUserErrorValues = Object.values(adicionarUsuarioErrors).filter(error => error !== "").length;
        const alterarSenhaErrorValues = Object.values(alterarSenhaErrors).filter(error => error !== "").length;
        
        const adicionarUser = Object.values(adicionarUsuarioValues).filter(value => value !== "").length;
        const alterarSenha = Object.values(alterarSenhaValues).filter(value => value !== "").length;
        console.log(alterarSenha)


        if(name === "adicionar-user") {
            if(adicionarUserErrorValues || adicionarUser === 1 && !displayModal) {
                event.preventDefault();
                return;
            }
        }
        if(name === "alterar-senha") {
            if(alterarSenhaErrorValues || alterarSenha === 0 && !displayModal) {
                event.preventDefault();
                return;
            }
        }

        if(name === "remover-user") {
            const usersToRemoveValues = Object.values(usersToRemoveChecked);
            if(!usersToRemoveValues.includes(true)) {
                event.preventDefault();
                return;
            }
        }

        event.preventDefault();
        myRef.current.scrollIntoView({behavior: 'instant', block: 'end'});
        setUsuarioOption(name);
        setDisplayModal(prev => !prev);
        setAdminPassword('');
        setErrorSubmitModal(false);
        setSuccessSubmitModal(false);
    }

    function handleChangeAdicionarUsuario(event) {
        const {name, value, checked} = event.target;
        let checkedInt;
        checkedInt = (checked) ? 1 : 0;

        setAdicionarUsuarioValues(prev => ({...prev, [name]: (name === 'admin') ? checkedInt : value}));
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

    function handleChangeAlterarSenha(event) {
        const {name, value} = event.target;

        setAlterarSenhaValues(prev => ({...prev, [name]: value}));
    }

    function handleChangeAdminPassword(event) {
        const {value} = event.target;

        setAdminPassword(value);
    }

    const [errorSubmitModal, setErrorSubmitModal] = useState(false);
    const [successSubmitModal, setSuccessSubmitModal] = useState(false);

    function handleSubmit() {
        
        if(adminPassword) {
            if(usuarioOption === 'adicionar-user') {
                axiosInstance.post('/adicionarUsuario', {...adicionarUsuarioValues, senha:adminPassword})
                .then((res) => {
                    setRefresh(prev => prev + 1);

                    if(res.status === 201) {
                        setSuccessSubmitModal(true);
                        setAdicionarUsuarioValues({fullname: '', username: '', senhaUser: '', admin: 0});
                    }
                })
                .catch(err => {
                    if(err.response.status === 401) {
                        setErrorSubmitModal('Senha incorreta');
                    }
                    else if(err.response.status === 409) {
                        setErrorSubmitModal('Usuário já existe');
                    }
                });
            }
            else if(usuarioOption === 'remover-user') {
                let ids = Object.keys(usersToRemoveChecked);
                ids = ids.filter(id => usersToRemoveChecked[id] === true);
                ids = ids.map(id => parseInt(id));
                
                axiosInstance.delete("/removerUsuario", {data: {ids, senha:adminPassword}})
                .then((res) => {
                    setRefresh(prev => prev + 1);

                    if(res.status === 200) {
                        setSuccessSubmitModal(true);
                        setUsersToRemoveChecked({});
                    }
                })
                .catch(err => {
                    if(err.response.status === 401) {
                        setErrorSubmitModal('Senha incorreta');
                    }
                });
            }
            else if(usuarioOption === 'alterar-senha') {
                axiosInstance.patch('/alterarSenhaUsuario', {...alterarSenhaValues, senha:adminPassword})
                .then((res) => {
                    setRefresh(prev => prev + 1);

                    if(res.status === 200) {
                        setSuccessSubmitModal(true);
                        setAlterarSenhaValues({username: '', novaSenha: ''});
                    }
                })
                .catch(err => {
                    if(err.response.status === 401) {
                        setErrorSubmitModal('Senha incorreta');
                    }
                    else if(err.response.status === 404) {
                        setErrorSubmitModal('Usuário não encontrado');
                    }
                });
            }

        }
    }

    useEffect(() => {
        console.log(adicionarUsuarioValues);
    }, [adicionarUsuarioValues]);

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
            <div className={(displayModal) ? "admin-password-modal-container" : "admin-password-modal-container-off"} onClick={event => handleModal(event)} >
                {!successSubmitModal && (
                <div className="admin-password-modal" onClick={event => event.stopPropagation()}>
                    <div className="admin-password-modal__input-field">
                        <label htmlFor="adminSenha">Insira sua senha</label>
                        <input type="password" 
                                name="adminSenha"
                                onChange={event => handleChangeAdminPassword(event)}
                                value={adminPassword}
                        />
                        {errorSubmitModal && <p>{errorSubmitModal}</p>}
                        
                    </div>
                    <div className="admin-password-modal__buttons">
                        <button onClick={event => handleModal(event)}>Cancelar</button>
                        <button onClick={handleSubmit}>Avançar</button>
                    </div>
                </div>
                )}
                {successSubmitModal && (
                    <div className="admin-password-modal-success" onClick={event => event.stopPropagation()}>
                         <button className="close-button" onClick={event => handleModal(event)}></button>
                         <div>
                            <img src={images.check} alt="Check logo" draggable="false"/>
                            <p>Sucesso!</p>
                         </div>
                    </div>
                )}
            </div>



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
                        <button name="adicionar-user" onClick={event => handleModal(event)}>Continuar</button>
                    </form>
                </div>
            </div>



            <div className={(removerUsuarioOpen) ? "remover-usuario-open" : "remover-usuario"} onClick={handleClickRemoverUsuario}>
                <div className="remover-usuario__label">
                    <p>Remover Usuário</p>
                </div>
                <div className={(removerUsuarioOpen) ? "remover-usuario__content-open" : "remover-usuario__content"} onClick={event => event.stopPropagation()}>
                    <div className="search-container">
                        <button className="remove-button" name="remover-user" onClick={event => handleModal(event)}> 
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
                        <button name="alterar-senha" onClick={event => handleModal(event)}>Continuar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Usuarios;