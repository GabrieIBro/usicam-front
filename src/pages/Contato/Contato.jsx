import React, {useState} from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Contato() {
	return(
		<>
			<Header/>
			<div className="page-introduction">
				<h1>Fale Conosco</h1>
				<p>Entre em contato através de um das opções abaixo ou preencha o formulário, e retornaremos o mais rápido possível.</p>
			</div>

			<div className="page-content">
				<form className="page-content__form">

				</form>

				<div className="page-content__info-contato">
					<div className="">
						<p>Telefone</p>
						<p>(71)9 9641-6117</p>
					</div>

					<div className="">
						<p>E-mail</p>
						<p>usicam.metal@gmail.com</p>
					</div>

					<div className="">
						<p>Endereço</p>
						<p>Rua do Uruguai, 456a, Salvador-BA</p>
					</div>
					<div className="page-content__info-contato__map">
						
					</div>
				</div>
			</div>
			<Footer/>
		</>
	);
}

export default Contato;