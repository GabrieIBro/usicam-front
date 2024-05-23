import React, {useState} from "react";
import images from "../../assets/images/images";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios";
import "./login.scss"
function Login() {

    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    function handleChange(event) {
        setFormValues(prev => ({...prev, [event.target.name] : event.target.value}))
    }

    function handleInput(event) {

        if(event.target.name === "username") {
            if(!formValues.username) {
                setFormErrors(prev => ({...prev, username: true}))
            }
            else {
                setFormErrors(prev => ({...prev, username: false}))
            }
        }
        else if(event.target.name === "senha") {
            if(!formValues.senha) {
                setFormErrors(prev => ({...prev, senha: true}))
            }
            else {
                setFormErrors(prev => ({...prev, senha: false}))
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if(!formErrors.username && !formErrors.senha) {
            const result = await axiosInstance.post(`login`, formValues);
            console.log(result);
        }
    }

    return(
        
        <div className="login-background">
            <div className="login-container">
                <div className="title-section">
                    <img src={images.logoUsicam} alt="USICAM logo" draggable="false"/>
                    <h1>Bem Vindo de Volta</h1>
                    <p>Acesso ao painel de administrador</p>
                </div>
                <div className="login-fields">
                    <form onSubmit={event => handleSubmit(event)}>
                        <div className="login-fields__input">
                            <label htmlFor="username">Usuário</label>
                            <input className={(formErrors.username) ? "input-error-active" : ""}
                                    type="text"
                                    name="username"
                                    onBlur={event => handleInput(event)}
                                    onChange={event => handleChange(event)}
                                    value={formValues.username}
                                    maxLength="20"
                            />
                            <p className={(formErrors.username) ? "error-message error-message-active": "error-message"}>Esse campo é obrigatório!</p>
                        </div>

                        <div className="login-fields__input senha">
                            <label htmlFor="senha">Senha</label>
                            <input className={(formErrors.senha) ? "input-error-active" : ""}
                                    type="password"
                                    name="senha"
                                    onBlur={event => handleInput(event)}
                                    onChange={event => handleChange(event)}
                                    value={formValues.senha}
                                    maxLength="64"
                            />
                            <p className={(formErrors.senha) ? "error-message error-message-active": "error-message"}>Esse campo é obrigatório!</p>


                            <p className="login-error">Usuário ou senha incorretos</p>
                        </div>
                        <div className="navigation-buttons">
                            <button onClick={() => navigate("/")}>Voltar</button>
                            <button type="submit">Avançar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;