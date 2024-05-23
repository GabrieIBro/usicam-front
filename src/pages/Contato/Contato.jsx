import React, {useState, useRef} from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "../../../config/axios";
import {InputMask} from "@react-input/mask";
import {Map, Marker, APIProvider} from "@vis.gl/react-google-maps"
import "./contato.scss";

function Contato() {
	const [values, setValues] = useState({});
	const [errors, setErrors] = useState({});
	const [submitResult, setSubmitResult] = useState("");

	const recaptcha = useRef();

	function handleChange(event) {
		setValues(prev => ({...prev, [event.target.name]: event.target.value}));
		setSubmitResult("");
	}

	function handleRecaptcha() {
		setValues(prev => ({...prev, captchaValue: recaptcha.current.getValue()}));
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
			
			const result = await axiosInstance.post(`novaMensagem`, values);
			
			if(result.status === 201) {
				setValues({nome:"", email:"", telefone:"", mensagem:"", captchaValue:"", success:true});
				setSubmitResult("Formulário Enviado com Sucesso!");
			}
			else {
				setSubmitResult("Falha no Envio do Formulário!");
			}
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
					<div className="page-content__info-contato">
						<div className="telefone">
							<p>Telefone</p>
							<p>(71)99641-6117</p>
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
							<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
								<Map defaultZoom={20} 
									defaultCenter={{lat: -12.930998, lng: -38.493318}}>
									
									<Marker position={{lat: -12.930998, lng: -38.493318}}
									onClick={() => window.location.href = "https://www.google.com/maps/place/Rua+do+Uruguay,+456a+-+Uruguai,+Salvador+-+BA,+40445-040/@-12.9309772,-38.4939715,19z/data=!3m1!4b1!4m6!3m5!1s0x7160557a910e6cf:0x72db87de1d3dca18!8m2!3d-12.9309785!4d-38.4933278!16s%2Fg%2F11f3vrrnfl?entry=ttu"}>
									</Marker>
				
								</Map>
							</APIProvider>
						</div>
					</div>

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
										onChange={handleRecaptcha}
							/>
							<button type="submit">Enviar</button>
						</div>
						<p className="submit-result">{submitResult}</p>
					</form>

				</div>
			</div>
			<Footer/>
		</>
	);
}

export default Contato;