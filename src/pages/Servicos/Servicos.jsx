import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../../config/axios";
import "./servicos.scss";

function Servicos() {
	const [images, setImages] = useState([]);

	useEffect(() => {
		axiosInstance.get('/servicosImagens')
		.then(res => {
			setImages(res.data);
			console.log("http://localhost:8080/api/servicos/" + res.data[0].filename)
		})
	}, [])

	function RenderImages() {
		return(
			<div className="gallery">{
				images.map((image, index) => (
						<div key={index} className="gallery__image-container" style={{backgroundImage: `url(http://${import.meta.env.VITE_SERVER_DOMAIN}:8080/api/servicos/${image.filename})`}}>
							<img src={`http://${import.meta.env.VITE_SERVER_DOMAIN}:8080/api/servicos/` + image.filename} alt="Service image" draggable="false" loading="lazy"/>
						</div>
				))
			}</div>
		)
	}

	return(
		<>
			<Header/>
			<div>
				<h1>Nossos Serviços</h1>
			</div>
			<RenderImages/>
			<Footer/>
		</>
	);
}

export default Servicos;