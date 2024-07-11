import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../../config/axios";
import images from "../../../assets/images/images";
import {formatDatetime} from "../../../utils/helpers";
import {InputMask} from "@react-input/mask"
import "./pedidos.scss";

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [filters, setFilters] = useState({prazo: 1, ascendente: 1});
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        axiosInstance.post("/pedidos", filters)
        .then(res => {
            setPedidos(res.data[0]);
        })
    }, [filters, refresh]);

    function handleChangeFilters(event) {
        const {name, value} = event.target
        setFilters(prev => ({...prev, [name]:+value}))
        // console.log(filters);
    }


    const [openModal, setOpenModal] = useState(false);
    const [modalOpenMode, setModalOpenMode] = useState();

    function toggleModal(event) {
        setOpenModal(prev => !prev);
        setModalOpenMode(event.target.name);

        if(openModal === false) {
            setEditPedidos(false);
        }
    }


    function handleKeyDown(event) {
        if(event.key === 'Escape') {
            toggleModal();
        }
    }

    useEffect(() => {
        if (openModal) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openModal]);

    const [pedidoModal, setPedidoModal] = useState({});
    const [pedidoUpdated, setPedidoUpdated] = useState({});

    function handleClickPedido(event) {
        const {id} = event.target;
        setPedidoModal(pedidos[id]);
        event.target.name = "pedido";
        toggleModal(event);

        const pedido = {...pedidos[id]};
        delete pedido["createdAt"];
        // pedido["prazo"] = formatDatetime(pedido["prazo"], 0);
        setPedidoUpdated(pedido);
    }

    const pedidosContentRef = useRef(null);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        function update() {
            setScrollWidth((pedidosContentRef?.current) ? pedidosContentRef?.current.scrollWidth : 0);
            setWindowWidth(window.innerWidth);
        }

        update();   

        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
        }

    }, [])

    const [editPedidos, setEditPedidos] = useState(false);

    function handleClickEditPedidos() {
        setEditPedidos(prev => !prev);
    }

    const modalPedidosRef = useRef(null);

    const [labelHeight, setLabelHeight] = useState({});

    //Get pedido-field <p> initial height
    useEffect(() => {
        if(modalPedidosRef?.current) {
            const fields = Array.from(modalPedidosRef.current.children);
            // console.log(fields)
            let labelHeightTemp = {};

            fields.forEach(field => {
                if(field.firstChild.firstChild.attributes?.name) {
                    const name = field.firstChild.firstChild.attributes.name.value;
                    const height = field.firstChild.firstChild.offsetHeight;

                    labelHeightTemp[name] = height;
                }
            })
            console.log(labelHeightTemp);
            setLabelHeight(labelHeightTemp);
        }
    }, [openModal])

    //Assign the initial height from pedido-field <p> to the textarea
    useEffect(() => {
        // console.log(modalPedidosRef?.current);

        if(modalPedidosRef?.current) {
            const fields = Array.from(modalPedidosRef.current.children);

            fields.forEach(field => {
                if(field.firstChild.lastChild.tagName === "TEXTAREA") {
                    const name = field.firstChild.firstChild.attributes.name.value;
                    field.firstChild.lastChild.style.height = labelHeight[name] + "px";
                }
            })
        }
    }, [editPedidos])

    function handleChangeModal(event) {
        const {name, value} = event.target;
        setPedidoUpdated(prev => ({...prev, [name]:value }));
        
        // When the user deletes a line of text, the height deacreses by one instead of going back to normal. 
        console.log(event.target.scrollHeight);

        if(event.target.tagName === "TEXTAREA") {
            event.target.style.height = event.target.scrollHeight + "px";

            setLabelHeight(prev => ({...prev, [name]:event.target.scrollHeight}));
        }
    }

    async function handleClickUpdatePedido() {
        const pedido = {...pedidoUpdated};
        delete pedido["id"];

        const id = Number(pedidoUpdated["id"]);

        await axiosInstance.patch("/alterarPedido", {id:id, data:{...pedido}})
        .then(() => {
            setRefresh(prev => prev + 1);
            setEditPedidos(false);
        })
        .catch(() => {

        });      
    }

    async function handleClickFinalizado() {
        await axiosInstance.patch("/alterarPedido", {id:pedidoModal.id, data:{finalizado:(!pedidoModal.finalizado) ? 1 : 0}})
        .then(() => {
            setPedidoUpdated(prev => ({...prev, finalizado: (!pedidoUpdated.finalizado) ? 1 : 0}));
            setPedidoModal(prev => ({...prev, finalizado: (!pedidoModal.finalizado) ? 1 : 0}));
            setRefresh(prev => prev + 1);

        })
    }

    const [dadosNovoPedido, setDadosNovoPedido] = useState({});
    const [errorsNovoPedido, setErrorsNovoPedido] = useState({});

    function handleChangeAdicionarPedido(event) {
        let {name, value} = event.target;

        if(["valor", "custoMaterial", "quantidade"].includes(name)) {
            value = value.split("");
            value = value.filter(char => "0123456789".includes(char));
            value = value.join("");
            // console.log(value)
        }

        setDadosNovoPedido(prev => ({...prev, [name]:(["valor", "custoMaterial", "quantidade"].includes(name)) ? +value : value}));
    }

    function RenderPedidos() {
        return(
            pedidos.map((pedido, index) => {
                const expDate = new Date(pedido.prazo);
                const dateNow = Date.now();

                return(
                    <div key={index} 
                    id={index} 
                    name="pedido" 
                    className={(pedido.finalizado) ? "pedidos-container__content__pedido-finalizado" : (dateNow > expDate) ? "pedidos-container__content__pedido-vencido" : "pedidos-container__content__pedido"} 
                    onClick={event => handleClickPedido(event)}
                    style={(windowWidth < 1920) ? {width: scrollWidth + "px"} : {width: "100%"}}
                    >
                    
                    <p>{(pedido.id > 9999) ? String(pedido.id).slice(0, 4) + '...' : pedido.id}</p>
                    <p>{(pedido.nome.length > 20) ? pedido.nome.slice(0 ,21) + '...' : pedido.nome}</p>
                    <p>{(pedido.descricao.length > 35) ? pedido.descricao.slice(0 ,36) + '...' : pedido.descricao}</p>
                    <p>{(pedido.material.length > 20) ? pedido.material.slice(0 ,21) + '...' : pedido.material}</p>
                    <p>{"R$" + pedido.valor.toFixed(2)}</p>
                    <p>{pedido.quantidade}</p>
                    <p>{(pedido.cliente.length > 20) ? pedido.cliente.slice(0 ,21) + '...' : pedido.cliente}</p>
                    <p>{formatDatetime(pedido.prazo, 0)}</p>
                </div>
                )
            })
        )
    }

    return(
        <div className="pedidos-container">
            <div className={(openModal) ? "pedidos-container__modal-wrapper" : "hidden"} onClick={toggleModal}>
                <div className="pedidos-container__modal-wrapper__modal" onClick={event => event.stopPropagation()} >
                    <button className="close-button" onClick={toggleModal}></button>
                    {(modalOpenMode === "pedido") && <button className="edit-button" onClick={handleClickEditPedidos} style={(editPedidos) ? {backgroundColor: "#606060" } : {}}>
                        <img src={images.pencil} alt="Edit icon" />
                    </button>}

                    {editPedidos && <button className="save-button" onClick={handleClickUpdatePedido}>Salvar</button>}
                    {editPedidos && <button className={(pedidoModal.finalizado) ? "finish-button-done": "finish-button"} onClick={handleClickFinalizado}>Finalizado</button>}
                    
                    {(modalOpenMode === "adicionar") && <button className="adicionar-button">Adicionar</button>}

                    <div className="modal-content">

                        {(modalOpenMode === "pedido") && 
                        <div ref={modalPedidosRef}>
                            <div className="pedido-field">
                                <div>
                                    <p>ID</p>
                                    <p>{pedidoModal.id}</p>
                                </div>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="nome">Nome</p>
                                    {!editPedidos && <p>{pedidoModal.nome}</p>}
                                    {editPedidos  && <textarea name="nome" value={pedidoUpdated.nome} onChange={event => handleChangeModal(event)} maxLength={64}></textarea>}
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="descricao">Descrição</p>
                                    {!editPedidos && <p>{pedidoModal.descricao}</p>}
                                    {editPedidos  && <textarea name="descricao" value={pedidoUpdated.descricao} onChange={event => handleChangeModal(event)} maxLength={300}></textarea>}
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p>Criado Em</p>
                                    <p>{formatDatetime(pedidoModal.createdAt, 0)}</p>
                                </div>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="prazo">Prazo</p>
                                    <p contentEditable={editPedidos} suppressContentEditableWarning={true} name="prazo">{formatDatetime(pedidoModal.prazo, 0)}</p>
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="material">Material</p>
                                    {!editPedidos && <p>{pedidoModal.material}</p>}
                                    {editPedidos  && <textarea name="material" value={pedidoUpdated.material} onChange={event => handleChangeModal(event)} maxLength={30}></textarea>}
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="valor">Valor</p>
                                    <p contentEditable={editPedidos} suppressContentEditableWarning={true} name="valor">{"R$" + pedidoModal.valor.toFixed(2)}</p>
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="custoMaterial">Custo Material</p>
                                    <p contentEditable={editPedidos} suppressContentEditableWarning={true} name="custoMaterial">{"R$" + pedidoModal.custoMaterial.toFixed(2)}</p>
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="quantidade">Quantidade</p>
                                    <p contentEditable={editPedidos} suppressContentEditableWarning={true} name="quantidade">{pedidoModal.quantidade}</p>
                                </div>
                                <p></p>
                            </div>

                            <div className="pedido-field">
                                <div>
                                    <p name="cliente">Cliente</p>
                                    <p contentEditable={editPedidos} suppressContentEditableWarning={true} name="cliente">{pedidoModal.cliente}</p>
                                </div>
                                <p></p>
                            </div>
                            
                            <div className="pedido-field">
                                <div>
                                    <p name="numero">Número</p>
                                    <p contentEditable={editPedidos} suppressContentEditableWarning={true} name="numero">{pedidoModal.numero}</p>
                                </div>
                                <p></p>
                            </div>
                        </div>
                        }

                        {(modalOpenMode === "adicionar") && 
                            <form>
                                <div>
                                    <label htmlFor="nome">Nome</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.nome}
                                            type="text" name="nome"/>
                                </div>
                                <div>
                                    <label htmlFor="descricao">Descrição</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.descricao}
                                            type="text" name="descricao"/>
                                </div>
                                <div>
                                    <label htmlFor="prazo">Prazo</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.prazo}
                                            type="date" name="prazo"/>
                                </div>
                                <div>
                                    <label htmlFor="material">Material</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.material}
                                            type="text" name="material"/>
                                </div>
                                <div>
                                    <label htmlFor="valor">Valor</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.valor}
                                            type="text" name="valor"/>
                                </div>
                                <div>
                                    <label htmlFor="custoMaterial">Custo Material</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.custoMaterial}
                                            type="text" name="custoMaterial"/>
                                </div>
                                <div>
                                    <label htmlFor="quantidade">Quantidade</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.quantidade}
                                            type="text" name="quantidade"/>
                                </div>
                                <div>
                                    <label htmlFor="cliente">Cliente</label>
                                    <input onChange={event => handleChangeAdicionarPedido(event)}
                                            value={dadosNovoPedido.cliente}
                                            type="text" name="cliente"/>
                                </div>
                                <div>
                                    <label htmlFor="nome">Número</label>
                                    <InputMask 	
                                        name="numero"
                                        type="tel" 
                                        mask="(__)_____-____" 
                                        replacement={{ _: /\d/ }}
                                        onChange={event => handleChangeAdicionarPedido(event)}
                                        value={dadosNovoPedido.numero}
                                        placeholder="(12)93456-7890"
                                    />
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>

            <div className="pedidos-container__controls">

                <button className="pedidos-container__controls__refresh" onClick={() => setRefresh(prev => prev + 1)}>
                    <img src={images.refresh} alt="Refresh icon"/>
                </button>

                <div className="pedidos-container__controls__prazo" onChange={event => handleChangeFilters(event)}>
                    <select name="prazo" id="" >
                        <option value="1">Prazo</option>
                        <option value="0">Criação</option>
                    </select>
                </div>

                <div className="pedidos-container__controls__recente" onChange={event => handleChangeFilters(event)}>
                    <select name="ascendente" id="">
                        <option value="1">Ascendente</option>
                        <option value="0">Descendente</option>
                    </select>
                </div>

                <button className="pedidos-container__controls__adicionar" name="adicionar" onClick={event => toggleModal(event)}>+ Adicionar Pedido</button>
            </div>

            <div className="pedidos-container__content" ref={pedidosContentRef}>
                <div className="pedidos-container__content__header"
                    style={(windowWidth < 1920) ? {width: scrollWidth + "px"} : {width: "100%"}}
>
                    <p>ID</p>
                    <p>Nome</p>
                    <p>Descrição</p>
                    <p>Material</p>
                    <p>Valor</p>
                    <p>Qtd.</p>
                    <p>Cliente</p>
                    <p>Prazo</p>
                </div>
                <RenderPedidos/>
            </div>
        </div>
    )
}

export default Pedidos;