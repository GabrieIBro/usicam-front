import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../config/axios";
import imageList from "../../../assets/images/images";
import "./publico.scss";

import ModalSenha from "../ModalSenha/ModalSenha";
import Popup from "../Popup/Popup";

function Publico() {
    const [images, setImages] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [requirePassword, setRequirePassword] = useState(+localStorage.getItem("requirePassword") <= Date.now());
    const [popupData, setPopupData] = useState({});
    const [displayModal, setDisplayModal] = useState(false);
    const [requestData, setRequestData] = useState({});
    const [modalParams, setModalParams] = useState({});

    const [image, setImage] = useState();

    const [response, setResponse] = useState({});
    const [timeouts, setTimeouts] = useState([]);

    function handlePopup(success, message) {

        if(timeouts.length > 0) {
            setPopupData({});

            timeouts.forEach(timer => {
                clearTimeout(timer);
            })
            setTimeouts([]);
        }
        setTimeout(() => {
            setPopupData({success, message});
            
            const timeout = setTimeout(() => {
                setPopupData({});
            }, 2500)
    
            setTimeouts(prev => ([...prev, timeout]));
        }, 50);
    }

    useEffect(() => {
        if(response.status >= 400) {
            handlePopup(false, response.message);
        }
        else {
            handlePopup(true, response.message)
        }
    }, [response]);

	useEffect(() => {
		axiosInstance.get('/servicosImagens')
		.then(res => {
			setImages(res.data);
		})
	}, [refresh]);

    function handleDrop(event) {
        const {files} = event.dataTransfer;
        setFileOver(false);
        event.preventDefault();
        event.stopPropagation()

        console.log(event.dataTransfer);
        
        if(files && files.length > 0) {
            const filename = files[0].name.toLowerCase();

            if(files[0].size >= 10485760) {
                return;
            }
            
            if(filename.endsWith("jpg") || filename.endsWith("svg") || filename.endsWith("png") || filename.endsWith("jpeg")) {
                setImage(files[0]);
            }
        }
    }

    function handleChangeBrowse(event) {
        const {files} = event.target;

        if(files && files.length > 0) {
            const filename = files[0].name.toLowerCase();
            if(filename.endsWith("jpg") || filename.endsWith("svg") || filename.endsWith("png") || filename.endsWith("jpeg")) {
                setImage(files[0]);
            }
        }
    }

    async function handleSubmit(event) {
        const {id, name} = event.currentTarget;
        let data;
        let params;

        if(name === "adicionar-imagem") {
            if(!image?.name) {
                return;
            }

            data = new FormData();
            data.append("imagem", image);
            params = {reqType: "POST", endpoint: "/uploadImagemServico", formData: true};

        }
        else if(name === "remover-imagem") {
            if(!id) {
                return;
            }
            
            data = {filename: id};
            params = {reqType: "DELETE", endpoint: "/removerImageServico"};
        }

        if(requirePassword) {
            setDisplayModal(true);
            setRequestData(data);
            setModalParams(params);
        }
        else {
            await axiosInstance({
                method: params.reqType,
                url: params.endpoint,
                data
            })
            .then(res => {
                handlePopup(true, res.data);
                setRefresh(prev => prev + 1);

                setImage(null);
            })
            .catch(err => {
                // setResponse(err.status, err.message)
                if(err.response.status === 413) {
                    handlePopup(false, "A imagem não deve exceder 10MB");
                    return;
                }
                handlePopup(false, err?.response.data || err.message);
            })

        }
    }

    const [fileOver, setFileOver] = useState(false);

    return(
        <div className="publico-container">
            {requirePassword && 
            <ModalSenha open={displayModal} 
                        onClose={() => {
                            setDisplayModal(false);
                            setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());
                        }}
                        data={requestData} 
                        params={modalParams}
                        onSuccess={() => {
                            setRefresh(prev => prev + 1);
                            setImage(null);
                        }}

                        response={setResponse}
            />}

            {popupData?.message && <Popup success={popupData?.success} message={popupData?.message}/>}
            <div className="publico-container__adicionar-imagem">
                <div>
                    <p>Adicionar Imagem (JPG, PNG, SVG)</p>
                    <button name="adicionar-imagem" 
                            onMouseOver={() => setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now())}
                            onClick={event => handleSubmit(event)}>Avançar</button>
                </div>
                <div onDrop={event => handleDrop(event)} 
                    onDragOver={(e) => {
                        setFileOver(true)
                        e.preventDefault();
                        e.stopPropagation()
                    }} 
                    onDragLeave={(e) => {
                        setFileOver(false)
                        e.preventDefault();
                        e.stopPropagation()
                    }}
                    style={(fileOver) ? {backgroundColor: "rgb(236, 236, 236)", border: "1px dashed rgb(122, 122, 122)"} : {}}
                    >
                    <p>Arraste um arquivo(Max. 10MB) até aqui ou </p>
                    <input type="file"
                    allow="image/*"
                    onChange={event => handleChangeBrowse(event)}
                    id="files"
                    />
                    <label htmlFor="files">{image?.name || "Buscar arquivo"}</label>
                </div>
            </div>
            <div className="publico-container__remover-imagens">
                {
                    images.map((image, index) => (
                        <div key={index} className="image-container" style={{backgroundImage: `url(${import.meta.env.VITE_SERVER_DOMAIN}/api/servicos/${image.filename})`}}>
                            <button id={image.filename} 
                                    onClick={event => handleSubmit(event)} 
                                    onMouseOver={() => setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now())}
                                    name="remover-imagem">

                                <img src={imageList.trash} alt="" />
                            </button>

                            <img src={`${import.meta.env.VITE_SERVER_DOMAIN}/api/servicos/` + image.filename} alt="Service image" draggable="false" loading="lazy"/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Publico;