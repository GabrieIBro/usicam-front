import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import images from "../../assets/images/images";
import './inicio.scss';
import { useNavigate } from "react-router-dom";

function Inicio() {
	const waveOnePath = `${images.inicioFirstWave}#svgView(preserveAspectRatio(none))`;
	const waveTwoPath = `${images.inicioSecondWave}#svgView(preserveAspectRatio(none))`;

	const navigate = useNavigate();

	return(
		<div className="main-container">
			<Header/>
			<div className="hero-container">
				<div className="hero">
					<div className="hero__text-content">
						<h1>Qualidade & Precisão em Cada Detalhe</h1>
						<p>Com o suporte de uma equipe altamente qualificada, a <b>USICAM</b> garante a continuidade do seu negócio.</p>
						<button onClick={() => navigate('/contato')}>Solicite seu orçamento</button>
					</div>
					<div className="hero__media-content">
						<img src={images.heroImage}></img>
					</div>
				</div>
			</div>
			<img src={waveOnePath} className="hero-wave" draggable="false"></img>

			<div className="section-two-container">
				<div className="section-two">
					<div className="section-two__media-content">
						<img src={images.millingMachine}></img>
					</div>
					<div className="section-two__text-content">
						<h2>25 Anos de Mercado</h2>
						<div className="section-two__text-content__description">
							<p className="description-one">Nossa empresa foi fundada em 1999, e desde então, tem se destacado pela  excelência em serviços e soluções inovadoras para a indústria. </p>
							<p className="description-two">Trabalhamos com uma ampla variedade de processos de  fabricação, incluindo usinagem de eixos, engrenagens, serviços de soldagem e outros.</p>
						</div>
					</div>
				</div>
			</div>
			<img src={waveTwoPath} className="section-two-wave" draggable="false"></img>

			<div className="section-three-container">
				<div className="section-three">
					<h3>Nosso Portfólio de Clientes</h3>
					<div className="section-three__parceiros">
						{images.parceiros.map((logo, index) => {
							return(
								<div key={index} className="parceiros__logo">
									<img src={logo} draggable="false"></img>
								</div>
							)
						})}
					</div>
				</div>
			</div>
			<Footer/>
		</div>
	);
}

export default Inicio;
