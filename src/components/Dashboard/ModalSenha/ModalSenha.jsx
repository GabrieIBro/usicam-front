import React, { useEffect, useState } from "react";
import "./modalsenha.scss";
import axiosInstance from "../../../../config/axios";

function ModalSenha({open, onClose, data, params, response, onSuccess}) {

    const [openModal, setOpenModal] = useState(open);

    console.log(data);
    //Update open status
    useEffect(() => {
        setOpenModal(open);
    }, [open]);

    
    function handleClose() {
        setOpenModal(false);
        onClose();
        setAdminPassword("");
    }

    //Close modal with Escape key
    useEffect(() => {
        function handleEsc(e) {
            if(e.key === "Escape") {
                handleClose();
            }
        }

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        }

    }, [])

    const [adminPassword, setAdminPassword] = useState("");

    function handleChange(event) {
        setAdminPassword(event.target.value);
    }

    async function handleSubmit() {
        let dataJoin;

        if(params?.formData) {
            dataJoin = data;
            dataJoin.append("senha", adminPassword);
        }
        else {
            dataJoin = {...data, senha:adminPassword};
        }

        await axiosInstance({
            method: params.reqType,
            url: params.endpoint,
            data: dataJoin
        })
        .then(res => {
            console.log(res);                
            response({status: res.status, message: res.data});
            onSuccess();
            handleClose();
            setAdminPassword("");
        })
        .catch(err => {
            console.log(err);
            response({status: err?.response.status, message: err?.response.data || err.message});
        })


        await axiosInstance.get("/requirePasswordAt")
        .then(res => {
            console.log(res.data)
            if(+res.data !== 0) {
                localStorage.setItem("requirePassword", +res.data);
            }
        })
    }

    return(
        <>
        {openModal &&
        <div className="modal-container" onClick={handleClose}>
            <div className="modal-senha" onClick={(e) => e.stopPropagation()}>
                <button className="fechar-button" onClick={handleClose}></button>
                <p>Confirme a sua senha</p>
                <input type="password"
                         onChange={event => handleChange(event)} 
                         value={adminPassword}/>

                <button className="avancar-button" onClick={handleSubmit}>Avançar</button>
            </div>
        </div>
        }
        </>
    )
}

export default ModalSenha;