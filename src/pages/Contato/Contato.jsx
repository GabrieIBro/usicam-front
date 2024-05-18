import React, {useState, useRef} from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import {InputMask} from "@react-input/mask";
import "./contato.scss";

function Contato() {
	const [values, setValues] = useState({});
	const [errors, setErrors] = useState({});

	const recaptcha = useRef();

	function handleChange(event) {
		setValues({...values, [event.target.name]: event.target.value});
	}

	function handleInput(event) {
		let {nome, email, telefone, mensagem} = values

		if(event.target.name === "nome") {
			if(!nome) {
				setErrors(prev => ({...prev, nome: "Esse campo é obrigatório!"}));
			}
			else if(nome.length <= 3) {
				setErrors(prev => ({...prev, nome: "O nome deve possuir no mínimo 4 caracteres!"}));

			}
			else {
				setErrors(prev => ({...prev, nome: ""}));
			}
		}

		else if(event.target.name === "email") {
			const emailRegex = /^[^.\s][\w-]+(\.[\w-]+)*@([\w-]+\.)+[\w-]{2,}$/g;

			if(!email) {
				setErrors(prev => ({...prev, email: "Esse campo é obrigatório!"}));
			}
			else if(!emailRegex.test(email)) {
				setErrors(prev => ({...prev, email: "Insira um e-mail válido!"}));

			}
			else {
				setErrors(prev => ({...prev, email: ""}));
			}
		}

		else if(event.target.name === "telefone") {
			const phoneRegex = /\(([1-9]{2})\)(9[1-9])[0-9]{3}-[0-9]{4}/g;

			if(!telefone) {
				setErrors(prev => ({...prev, telefone: "Esse campo é obrigatório!"}));
			}
			else if(!phoneRegex.test(telefone)) {
				setErrors(prev => ({...prev, telefone: "Insira um número de telefone válido!"}));

			}
			else {
				setErrors(prev => ({...prev, telefone: ""}));
			}
		}

		else if(event.target.name === "mensagem") {
			if(!mensagem) {
				setErrors(prev => ({...prev, mensagem: "Esse campo é obrigatório!"}));
			}
			else if(mensagem.length < 50) {
				setErrors(prev => ({...prev, mensagem: "A mensagem deve possuir no mínimo 50 caracteres!"}));
			}
			else {
				setErrors(prev => ({...prev, mensagem: ""}));
			}
		}

	}

	async function handleSubmit(e) {
		e.preventDefault();

		let errorList = Object.values(errors);
		errorList = errorList.filter(item => item !== "");
		
		if(errorList.length === 0 && recaptcha.current.getValue()) {

			setValues(prev => ({...prev, captchaValue: recaptcha.current.getValue()}));
			
			const result = await axios.post(`http://localhost:8080/api/novaMensagem`, values);
			console.log(result);
		}
	}

	return(
		<>
			<Header/>
			<div className="page-introduction">
				<h1>Fale Conosco</h1>
				<p>Entre em contato através de um das opções abaixo ou preencha o formulário, e retornaremos o mais rápido possível.</p>
			</div>
			
			<div className="page-content-container">
				<div className="page-content">
					<form className="page-content__form" 
							onSubmit={(event) => handleSubmit(event) }>

						<div className="form-field">
							<label htmlFor="nome">Nome</label>
							<input 
								className={(errors.nome) ? "active-error" : ""}
								name="nome"
								type="text" 
								id="nome"
								maxLength="70"
								value={values.nome}
								onChange={(event) => handleChange(event)}
								onBlur={event => handleInput(event)}
							/>
							<p>{errors.nome}</p>
						</div>

						<div className="form-field">
							<label htmlFor="email">E-mail</label>
							<input
								className={(errors.email) ? "active-error" : ""}
								name="email"
								type="text" 
								id="email"
								value={values.email}
								onChange={(event) => handleChange(event)}
								onBlur={event => handleInput(event)}
							/>
							<p>{errors.email}</p>
						</div>

						<div className="form-field">
							<label htmlFor="telefone">Telefone</label>
							{/* <input 
								className={(errors.telefone) ? "active-error" : ""}
								name="telefone"
								type="tel" 
								id="telefone"
								value={values.telefone}
								maxLength="14"
								onChange={(event) => handleChange(event)}
								onBlur={event => handleInput(event)}
							/> */}
							<InputMask 	
								className={(errors.telefone) ? "active-error" : ""}
								name="telefone"
								type="tel" 
								id="telefone"
								mask="(__)_____-____" 
								replacement={{ _: /\d/ }}
								value={values.telefone}
								onChange={(event) => handleChange(event)}
								onBlur={event => handleInput(event)}		
							/>

							<p>{errors.telefone}</p>
						</div>

						<div className="form-field form-field-textarea">
							<label htmlFor="mensagem">Mensagem</label>
							<textarea 
								className={(errors.mensagem) ? "active-error" : ""}
								name="mensagem" 
								id="mensagem"
								value={values.mensagem}
								onChange={(event) => handleChange(event)}
								onBlur={event => handleInput(event)}
								maxLength="1000"
							>
							</textarea>
							<p>{errors.mensagem}</p>
						</div>
						<div className="submit-section">
							<ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} 
										hl="pt-BR"
										ref={recaptcha}
							/>
							<button type="submit">Enviar</button>
						</div>
					</form>

					<div className="page-content__info-contato">
						<div className="telefone">
							<p>Telefone</p>
							<p>(71)9 9641-6117</p>
						</div>

						<div className="email">
							<p>E-mail</p>
							<p>usicam.metal@gmail.com</p>
						</div>

						<div className="endereco">
							<p>Endereço</p>
							<p>Rua do Uruguai, 456a, Salvador-BA</p>
						</div>
						<div className="page-content__info-contato__map">

						</div>
					</div>
				</div>
			</div>
			<Footer/>
		</>
	);
}

export default Contato;