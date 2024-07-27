import React, {useState, useEffect} from "react";
import images from "../../assets/images/images";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios";
import "./login.scss"
function Login() {
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect( () => {
        async function checkLogin() {
            const result = await axiosInstance.get('/checkLogin');
            
            if(result.status === 200) {
                navigate('/dashboard/inicio');
            }
        }
        checkLogin();

    }, [navigate])


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

    function handleSubmit(event) {
        event.preventDefault();

        if(!formErrors.username && !formErrors.senha && formValues.username && formValues.senha) {
            setLoading(true);

            setTimeout(async () => {
                try {
                    const result = await axiosInstance.post(`/login`, formValues);
                    
                    if(result.status === 200) {
                        setLoginError("");
                        navigate('/dashboard');
                        localStorage.setItem("requirePassword", (Date.now() + 120000));
                    }
                } 
                catch (error) {
                    console.error(error)
                    setLoginError('Usuário ou senha incorretos')
                }
                finally {
                    setLoading(false);
                }
            }, 1000)
        }
    }

    return(
        
        <div className="login-background">
            <div className="login-container">
                <div className={(loading) ? "loading-overlay" : ""} style={{position: 'absolute'}}></div>
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
                                    onFocus={() => setLoginError('')}
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
                                    onFocus={() => setLoginError('')}
                                    value={formValues.senha}
                                    maxLength="64"
                            />
                            <p className={(formErrors.senha) ? "error-message error-message-active": "error-message"}>Esse campo é obrigatório!</p>


                            <p className="login-error">{loginError}</p>
                        </div>
                        <div className="navigation-buttons">
                            <button type="button" onClick={() => navigate("/")}>Voltar</button>
                            <button type="submit" disabled={loading}>Avançar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;