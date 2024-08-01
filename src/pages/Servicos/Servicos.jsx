import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axiosInstance from "../../../config/axios";
import imageList from "../../assets/images/images";

import "./servicos.scss";
import { useNavigate } from "react-router-dom";

function Servicos() {
	useEffect(() => {
		axiosInstance.post("/analytics");
	}, []);

	const navigate = useNavigate();

	const [wide, setWide] = useState(false);

	useEffect(() => {
		function setScreenWidth() {
			console.log(window.screen.width)
			if(window.screen.width > 2752) {
				setWide(true);
			}
			else {
				setWide(false);
			}
		}

		window.addEventListener("resize", setScreenWidth)

		return () => {
			window.removeEventListener("resize", setScreenWidth)
		}
	}, []);

	const [images, setImages] = useState([]);

	useEffect(() => {
		axiosInstance.get('/servicosImagens')
		.then(res => {
			setImages(res.data);
		})
	}, [])

	const imagesDOM = useRef([]);
	const [expandedImage, setExpandedImage] = useState({a:null});
	const [imagesPosition, setImagesPosition] = useState({})

	function addImagePosition() {
		if(imagesDOM.current) {
			let positions = {};

			imagesDOM.current.forEach(image => {
				const rect= image.getBoundingClientRect();
				const screenCenter = window.screen.width / 2;

				let classname;

				if(rect.left > screenCenter && rect.right > screenCenter) {
					classname = "gallery__image-container-left";
				}
				else if(rect.left < screenCenter && rect.right < screenCenter) {
					classname = "gallery__image-container-right";
				}
				else {
					classname = "gallery__image-container-center";
				}

				positions = {...positions, [image.id]:classname};
			})
			console.log(positions)
			setImagesPosition(positions);
		}
	}

	function handleClickImage(event) {

		addImagePosition();
		
		const {id} = event.currentTarget;

		if(expandedImage?.[id]) {
			setExpandedImage({[id]: null});
			return;
		}

		if(!imagesDOM?.current) {
			return;
		}

		let index;

		images.forEach((image, idx) => {
			if(image.filename === id) {
				index = idx;
			}
		})
		
		const currentImage = imagesDOM.current[index];
		const rect= currentImage.getBoundingClientRect();
		const screenCenter = window.screen.width / 2;

		let classname;

		if(rect.left > screenCenter && rect.right > screenCenter) {
			classname = "gallery__image-container-expand-left";
		}
		else if(rect.left < screenCenter && rect.right < screenCenter) {
			classname = "gallery__image-container-expand-right";
		}
		else {
			classname = "gallery__image-container-expand-center";
		}

		setExpandedImage({[id]: classname});
	}

	function collapseImage() {
		const key = Object.keys(expandedImage)[0];

		console.log(expandedImage[key])

		if(expandedImage[key] === null) {
			return;
		}

		const tempObj = {[key]:null};
		setExpandedImage(tempObj);
	}

	function RenderImages() {
		return(
			<div className={(wide) ? "gallery-wide" : "gallery"}
				onClick={collapseImage}
			>{
				images.map((image, index) => (
					<div className="container-placeholder"
						key={index}
						style={(!expandedImage || Object.values(expandedImage)[0] !== null) ? {filter: (!expandedImage?.[image.filename]) ? "blur(20px)" : ""} : {}}
					>
						<div className={(expandedImage?.[image.filename]) ? expandedImage?.[image.filename] : 
										(imagesPosition?.[image.filename]) ? imagesPosition?.[image.filename] : "gallery__image-container"} 
							id={image.filename}
							onClick={event => {
								event.stopPropagation()
								handleClickImage(event)
							}}
							// animation: collapse linear 100ms;

							style={{
									backgroundImage: `url(${import.meta.env.VITE_SERVER_DOMAIN}/api/servicos/${image.filename})`, 
									animation: (expandedImage?.[image.filename] === null && 
												(imagesPosition?.[image.filename].includes("center"))) ? "collapse-center linear 70ms" : 
												(expandedImage?.[image.filename] === null) ? "collapse linear 70ms" : ""
							}}
							ref={el => imagesDOM.current[index] = el}
						>
							<img src={`${import.meta.env.VITE_SERVER_DOMAIN}/api/servicos/` + image.filename} alt="Service image" draggable="false" loading="lazy"/>
						</div>
					</div>
				))
			}</div>
		)
	}

	return(
		<div className="servicos-container">
			<Header/>

			<div className="introduction-container">
				<div className="introduction-container__text">
					<h1>Como Podemos Ajudar?</h1>
					<p>Confira alguns dos diferentes serviços que oferecemos</p>
				</div>
				<div className="introduction-container__servicos">
					<div>
						<div className="image-container-servico">
							<img src={imageList.milling} draggable="false" alt="" />
						</div>
						<p>Fresamento</p>
					</div>
					<div>
						<div className="image-container-servico">
							<img src={imageList.lathe} draggable="false" alt="" />
						</div>
						<p>Tornearia</p>
					</div>
					<div>
						<div className="image-container-servico">
							<img src={imageList.cogwheel} draggable="false" alt="" />
						</div>
						<p>Fabricação de Engrenagens</p>
					</div>
					<div>
						<div className="image-container-servico">
							<img src={imageList.welding} draggable="false" alt="" />
						</div>
						<p>Soldagem</p>
					</div>
				</div>
				<div className="introduction-container__outros" draggable="false" onClick={() => navigate("/contato")}>
					<img src={imageList.plus} width="40px" alt="" />
					<p>Outros</p>
				</div>
			</div>
			<RenderImages/>
			<Footer/>
		</div>
	);
}

export default Servicos;