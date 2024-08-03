import React from "react";
import "./overview.scss";

function Overview() {
    return(
        <div className="overview-container">
            <div className="overview-container__widget">
                <p>Faturamento Bruto</p>
            </div>
            <div className="overview-container__widget">
                <p>Faturamento Líquido</p>
            </div>
            <div className="overview-container__widget">
                <p>Faturamento Bruto</p>
            </div>
        </div>
    )
}

export default Overview;