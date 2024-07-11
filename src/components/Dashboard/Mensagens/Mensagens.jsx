import React, {useEffect, useState} from "react";
import axiosInstance from "../../../../config/axios";
import { formatDatetime } from "../../../utils/helpers";
import "./mensagens.scss"
import images from "../../../assets/images/images";

function Mensagens() {
    const [messages, setMessages] = useState([]);
    const [filterValues, setFilterValues] = useState({recente:1});
    const [checkState, setCheckState] = useState({});
    const [deleteCount, setDeleteCount] = useState(0);
    const [messageModal, setMessageModal] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [checkAllState, setCheckAllState] = useState(false);

    useEffect(() => {
        async function fetchData() {
            axiosInstance.post('/mensagens', filterValues)
            .then(res => {
                setMessages(res.data);

                res.data.map(message => {
                    setCheckState(prev => ({...prev, [message.id]:false}));
                })
            })
        }

        fetchData();
    }, [filterValues, deleteCount, messageModal, refresh])

    function handleFilterChange(event) {
        let {name, value} = event.target;

        setFilterValues(prev => ({...prev, [name]:(name === 'recente') ? +value : value}));
    }
    
    const ids = Object.keys(checkState);

    function handleCheckAll(event) {
        const {checked} = event.target;

        setCheckAllState(prev => !prev);

        ids.forEach((id) => {
            setCheckState(prev => ({...prev, [id]:checked}))
        })
    }

    useEffect(() => {
        const values = Object.values(checkState);
        console.log(values);
        if(values.includes(false)) {
            setCheckAllState(false);
        }
        else if(!values.includes(false) && values.length >= 1) {
            setCheckAllState(true);
        }
        
    }, [checkState]);

    function handleCheck(event) {
        const {id, checked} = event.target

        setCheckState(prev => ({...prev, [id]:checked}));
    }

    async function handleDeleteMessage() {
        
        const deleteIds = ids.filter(id => checkState[id] === true);

        axiosInstance.delete('/removerMensagens', {data:{ids:deleteIds}})
        .then(() => {
            setDeleteCount(prev => prev + 1);
        })
    }

    function handleClickMessage(event) {
        const {id} = event.currentTarget;
        
        setModalIsOpen(prev => !prev);
        setMessageModal(messages[id]);
    }

    function closeModal() {
        setModalIsOpen(prev => !prev);
    }
    
    function handleKeyDown(event) {
        if(event.key === 'Escape') {
            closeModal();
        }
    }

    useEffect(() => {
        if (modalIsOpen) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [modalIsOpen]);

    function handleSeenButton() {

        axiosInstance.patch('/vizualizarMensagem', {id:messageModal.id, value:(messageModal.visto) ? 0 : 1})
        .then(() => {
            setMessageModal(prev => ({...prev, visto:(messageModal.visto) ? 0 : 1}));
        })
    }

    function handleRefreshButton() {
        setRefresh(prev => !prev);
    }

    function RenderMessages() {
        return (
            messages.map((message, index) => (
                <div key={message.id}
                    id={index}
                    className={(message.visto) ? "mensagens-item mensagens-item-visto" : "mensagens-item" }
                    onClick={event => handleClickMessage(event)}>

                    <input type="checkbox" 
                            name="selected" 
                            id={message.id}
                            onChange={event => handleCheck(event)}
                            checked={checkState[message.id]}
                            onClick={event => event.stopPropagation()}
                    />

                    <div className="mensagens-item__nome">
                        <p>{message.nome}</p>
                    </div>
                    <div className="mensagens-item__mensagem">
                        <p>{message.mensagem}</p>
                    </div>
                    <div className="mensagens-item__data">
                        <p>{formatDatetime(message.createdAt)}</p>
                    </div>
                </div>
            ))
        )
    }


    return(
        <div className="content-wrapper">
            <div className="mensagens-controls">
                <div className="mensagens-controls__remove-resync">
                    <input type="checkbox" name="selected" onChange={event => handleCheckAll(event)} checked={checkAllState}/>
                    <button onClick={handleDeleteMessage}>
                        <img src={images.trash} alt="" />
                    </button>

                    <button onClick={handleRefreshButton} className="refresh-button">
                        <img src={images.refresh} alt="" />
                    </button>
                </div>
                
                <div className="mensagens-controls__date">
                    <p>De</p>
                    <input type="date" name="minDate" onChange={event => handleFilterChange(event)}/>
                    <p> Até</p>
                    <input type="date" name="maxDate" id="" onChange={event => handleFilterChange(event)}/>
                </div>
                <div className="select-wrapper">
                    <select name="recente" onChange={event => handleFilterChange(event)} className="mensagens-controls__recent"  >
                        <option value="1">Mais Recentes</option>
                        <option value="0">Mais Antigas</option>
                    </select>
                </div>
            </div>
            <div className="mensagens-container">
                <RenderMessages/>
            </div>
            <div className="modal-container" style={(modalIsOpen) ? {display: "flex"} : {display: "none"}} onClick={closeModal}>
                <div className="modal" onClick={event => event.stopPropagation()}>
                    <button className="seen-button" onClick={handleSeenButton}>
                        <img src={(messageModal.visto) ? images.eyeClosed : images.eye} alt="" />
                    </button>
                    <button className="close-button" onClick={closeModal}></button>
                    <div className="modal__message-content">
                        <p>{messageModal.nome}</p>
                        <p>{messageModal.email}</p>
                        <p>{messageModal.telefone}</p>
                        <p className="modal__message-content__mensagem">{messageModal.mensagem}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mensagens;