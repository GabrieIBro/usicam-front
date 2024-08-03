import React, {useEffect, useState} from "react";
import axiosInstance from "../../../../config/axios";
import { formatDatetime } from "../../../utils/helpers";
import "./mensagens.scss"
import images from "../../../assets/images/images";

import ModalSenha from "../ModalSenha/ModalSenha";
import Popup from "../Popup/Popup";

function Mensagens() {
    const [messages, setMessages] = useState([]);
    const [noMessage, setNoMessage] = useState(false);
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
                if(res.data.length === 0) {
                    setNoMessage(true);
                    setMessages(res.data);
                }
                else {
                    setMessages(res.data);
                    setNoMessage(false);
                }
                console.log(res.data);

                setCheckState({});

                res.data.map(message => {
                    setCheckState(prev => ({...prev, [message.id]:false}));
                })
            })
        }

        fetchData();
    }, [filterValues, deleteCount, messageModal, refresh])

    const [popupData, setPopupData] = useState({});
    const [timeouts, setTimeouts] = useState([]);
    const [requirePassword, setRequirePassword] = useState(+localStorage.getItem("requirePassword") <= Date.now());
    const [displayModalSenha, setDisplayModalSenha] = useState(false);
    const [modalParams, setModalParams] = useState({});
    const [requestData, setRequestData] = useState({});
    const [response, setResponse] = useState({});

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

    function handleFilterChange(event) {
        let {name, value} = event.target;
        if(value === "") {
            const tempObj = {...filterValues};
            delete tempObj[name];

            setFilterValues(tempObj);
            return;
        }
        setFilterValues(prev => ({...prev, [name]:(name === 'recente') ? +value : value}));
    }
    
    const ids = Object.keys(checkState);

    function handleCheckAll(event) {
        const {checked} = event.target;

        setCheckAllState(prev => !prev);

        ids.forEach((id) => {
            setCheckState(prev => ({...prev, [id]:checked}))
        })

        setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());

    }

    useEffect(() => {
        const values = Object.values(checkState);
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

        setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());
    }

    async function handleDeleteMessage() {
        
        const deleteIds = ids.filter(id => checkState[id] === true);

        if(deleteIds.length === 0) {
            return;
        }

        if(requirePassword) {
            setDisplayModalSenha(true);
            setRequestData({ids:deleteIds});
            setModalParams({endpoint: "/removerMensagens", reqType: "DELETE"});
        }
        else {
            axiosInstance.delete('/removerMensagens', {data:{ids:deleteIds}})
            .then(() => {
                setDeleteCount(prev => prev + 1);
                handlePopup(true, "Mensagem deletada com sucesso!");
            })
            .catch(err => {
                handlePopup(false, err?.response.data || err.message);
            })
        }
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
        console.log(checkState);
        console.log(messages);
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
        <div className="content-wrapper-mensagens">
            {popupData?.message && <Popup success={popupData.success} message={popupData.message}/>}
            {requirePassword && 
            <ModalSenha open={displayModalSenha}
                        data={requestData}
                        params={modalParams}
                        response={setResponse}
                        onClose={() => {
                            setDisplayModalSenha(false);
                            setRequirePassword(+localStorage.getItem("requirePassword") <= Date.now());
                        }}
                        onSuccess={() => setRefresh(prev => prev + 1)}

            />}

            <div className="mensagens-controls">
                <div className="mensagens-controls__remove-resync">
                    <input type="checkbox" name="selected" onChange={event => handleCheckAll(event)} checked={checkAllState}/>
                    <button onClick={handleDeleteMessage}>
                        <img src={images.trash} alt="Trash icon" />
                    </button>

                    <button onClick={handleRefreshButton} className="refresh-button">
                        <img src={images.refresh} alt="Refresh icon" />
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
            {messages.length !== 0 &&
            <div className="mensagens-label">
                <div>
                    <p>De</p>
                </div>
                <div>
                    <p>Mensagem</p>
                </div>
                <div>
                    <p>Recebido</p>
                </div>
            </div>
            }
            <div className="mensagens-container">
                {messages.length === 0 && 
                <div className="loading">
                    {noMessage === false && messages.length === 0 && <p>Carregando...</p>}
                    {noMessage === true && <p>Caixa de mensagens vazia</p>}
                </div>}
                <RenderMessages/>
            </div>
            <div className="modal-container" style={(modalIsOpen) ? {display: "flex"} : {display: "none"}} onClick={closeModal}>
                <div className="modal" onClick={event => event.stopPropagation()}>
                    <button className="seen-button" onClick={handleSeenButton}>
                        <img src={(messageModal.visto) ? images.eyeClosed : images.eye} alt="Eye logo" />
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