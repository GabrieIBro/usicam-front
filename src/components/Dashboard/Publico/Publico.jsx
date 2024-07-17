import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axios";
import imageList from "../../../assets/images/images";
import "./publico.scss";

function Publico() {
    const [images, setImages] = useState([]);
    const [refresh, setRefresh] = useState(0);

	useEffect(() => {
		axiosInstance.get('/servicosImagens')
		.then(res => {
			setImages(res.data);
		})
	}, [refresh]);

    async function handleDeleteImage(event) {
        const {id} = event.target;

        await axiosInstance.delete("/removerImageServico", {filename: id})
        .then(() => {
            setRefresh(prev => prev + 1);
        })
        .catch(err => {

        })
    }

    return(
        <div className="publico-container">
            <div className="publico-container__adicionar-imagem">
                <p>Adicionar Imagem</p>
                <div>
                    <p>Arraste um arquivo até aqui ou </p>
                    <input type="file" />
                </div>
            </div>
            <div className="publico-container__remover-imagens">
                {
                    images.map((image, index) => (
                        <div key={index} className="image-container" style={{backgroundImage: `url(http://localhost:8080/api/servicos/${image.filename})`}}>
                            <button id={image.filename} onClick={event => handleDeleteImage(event)}>
                                <img src={imageList.trash} alt="" />
                            </button>
                            <img src={"http://localhost:8080/api/servicos/" + image.filename} alt="Service image" draggable="false" loading="lazy"/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Publico;