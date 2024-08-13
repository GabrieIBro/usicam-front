import React, { useEffect, useState } from "react";
import images from "../../../assets/images/images"
import axiosInstance from "../../../../config/axios";
import { formatValues } from "../../../utils/helpers";

import Chart, { defaults } from "chart.js/auto"
import {Line} from "react-chartjs-2"

import "./overview.scss";

function Overview() {
    const [overviewData, setOverviewData] = useState({});

    const date = new Date(Date.now());
    const [fatBruto, setFatBruto] = useState({year: date.getFullYear(), month: date.getMonth()});
    const [fatLiquido, setFatLiquido] = useState({year: date.getFullYear(), month: date.getMonth()});

    useEffect(() => {
        axiosInstance.post("/overviewData", {anoBruto: fatBruto.year, anoLiquido: fatLiquido.year})
        .then(res => {
            setOverviewData(res.data);
        })
    }, [fatBruto.year, fatLiquido.year]);


 

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    function Faturamento({data, date, setDate}) {
        
        const year = new Date(Date.now()).getFullYear();


        function handleClickArrows(event) {
            const {id} = event.target;

            let currentMonth = date.month;
            let currentYear = date.year;

            console.log(id);

            if(id === 'month-left') {
                currentMonth--;

                if(currentMonth === -1) {
                    currentMonth = 11;
                    currentYear--;
                }

                setDate({month:currentMonth, year: currentYear});
                return;
            }
            if(id === 'month-right') {
                currentMonth++;

                if(currentMonth === 12) {
                    currentMonth = 0;

                    if(currentYear !== year) {
                        currentYear++;
                    }
                }

                setDate({month:currentMonth, year: currentYear});
                return;
            }
            if(id === 'year-left') {
                currentYear--;

                setDate(prev => ({...prev, year:currentYear}));
                return;
            }
            if(id === 'year-right') {
                if(currentYear !== year) {
                    currentYear++;
                }

                setDate(prev => ({...prev, year:currentYear}));
                return;
            }
        }

        console.log(data);

        return(
            <div className="content__faturamento">
                <div className="faturamento__month">
                    <div className="faturamento__arrow-left" id="month-left" onClick={event => handleClickArrows(event)}></div>

                    <div className="month__text">
                        <p className="month__title">{months[date.month]}</p>
                        <p className="month__value">{(!data) ? "0" : `R$ ${formatValues(data[date.month])}`}</p>
                    </div>

                    <div className="faturamento__arrow-right" id="month-right" onClick={event => handleClickArrows(event)}></div>
                </div>
                
                <div className="faturamento__year">
                    <div className="faturamento__arrow-left" id="year-left" onClick={event => handleClickArrows(event)}></div>

                    <div className="year__text">
                        <p className="year__title">{date.year}</p>
                        <p className="year__value">{(!data) ? "0" : `R$ ${formatValues(data.reduce((a, b) => a + b))}`}</p>
                    </div>

                    <div className="faturamento__arrow-right" id="year-right" onClick={event => handleClickArrows(event)}></div>
                </div>
            </div>
        )
    }

    return(
        <div className="overview-container">
            <div className="overview-container__widget">
                <p className="widget__title">Faturamento Bruto</p>
                <div className="widget__content">
                    <Faturamento data={overviewData.fatBruto} date={fatBruto} setDate={setFatBruto}/>
                </div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Faturamento Líquido</p>
                <div className="widget__content">
                    <Faturamento data={overviewData.fatLiquido} date={fatLiquido} setDate={setFatLiquido}/>
                </div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Novas Mensagens</p>
                <div className="widget__content">
                    <div className="content__image-container">
                        <img src={images.bell} alt="Bell icon" draggable="false"/>
                    </div>
                    <p className="content__count">{overviewData.novasMensagens}</p>
                </div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Tráfego de Usuários</p>
                <div className="widget__content">
                    <Line data={{
                        labels: months,
                        datasets: [
                            {
                                label: "Acessos Totais",
                                data: overviewData.acessosTotais,
                                backgroundColor: "#697cff",
                                borderColor: "#697cff"
                            },
                            {
                                label: "Acessos Únicos",
                                data: overviewData.acessosUnicos,
                                backgroundColor: "#64facd",
                                borderColor: "#64facd"
                            }
                        ]                                         
                    }
                    }
                    options={{
                        maintainAspectRatio: false
                    }}
                    />
                </div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Pedidos Abertos</p>
                <div className="widget__content">
                    <div className="content__image-container">
                        <img src={images.stopwatch} alt="Stopwatch icon" draggable="false"/>
                    </div>
                    <p className="content__count">{overviewData.pedidosAbertos}</p>
                </div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Pedidos Vencidos</p>
                <div className="widget__content">
                    <div className="content__image-container">
                        <img src={images.hourglass} alt="Hourglass icon" draggable="false" width={150}/>
                    </div>
                    <p className="content__count">{overviewData.pedidosVencidos}</p>
                </div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Lorem Ipsum 7</p>
                <div className="widget__content"></div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Lorem Ipsum 8</p>
                <div className="widget__content"></div>
            </div>
            <div className="overview-container__widget">
                <p className="widget__title">Lorem Ipsum 9</p>
                <div className="widget__content"></div>
            </div>
        </div>
    )
}

export default Overview;