import React, {useEffect, useState} from "react";
import axiosInstance from "../../../../config/axios";
import { formatDatetime } from "../../../utils/helpers";
import "./mensagens.scss"
import images from "../../../assets/images/images";

function Mensagens() {
    const [messages, setMessages] = useState([]);
    const [filterValues, setFilterValues] = useState({recente:'1'});

    useEffect(() => {
        async function fetchData() {
            axiosInstance.post('/mensagens', filterValues)
            .then(res => {
                setMessages(res.data);
            })
        }

        fetchData();
    }, [filterValues])

    function handleFilterChange(event) {
        let {name, value} = event.target;

        setFilterValues(prev => ({...prev, [name]:(name === 'recente') ? +value : value}));
    }

    function RenderMessages() {
        return (
            messages.map((message) => (
                <div key={message.id} className="mensagens-item">
                    <input type="checkbox" name="selected"/>
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

    const [recentOpen, setRecentOpen] = useState(false);

    function handleClickRecent() {
        setRecentOpen(prev => !prev);
    }

    return(
        <div style={{width: "100%"}}>
            <div className="mensagens-controls">
                <div className="mensagens-controls__remove">
                    <input type="checkbox" name="selected"/>
                    <button>
                        <img src={images.trash} alt="" />
                    </button>
                </div>
                
                <div className="mensagens-controls__date">
                    <input type="date" name="minDate" id="" onChange={event => handleFilterChange(event)}/>
                    <p>-</p>
                    <input type="date" name="maxDate" id="" onChange={event => handleFilterChange(event)}/>
                </div>
                <div className={(recentOpen) ? "select-wrapper-open" : "select-wrapper"} onClick={handleClickRecent}>
                    <select name="recente" onChange={event => handleFilterChange(event)} className="mensagens-controls__recent">
                        <option value="1">Mais Recentes</option>
                        <option value="0">Mais Antigas</option>
                    </select>
                </div>
            </div>
            <div className="mensagens-container">
                <RenderMessages/>
            </div>
        </div>
    )
}

export default Mensagens;