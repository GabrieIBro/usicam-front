import React, { useEffect } from "react";
import images from "../../assets/images/images";
import "./spinner.scss";

function Spinner() {

    useEffect(() => {
        function blockInput(e) {
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

    window.addEventListener("click", blockInput, true);
    window.addEventListener("mousedown", blockInput, true);
    window.addEventListener("mouseup", blockInput, true);
    window.addEventListener("keydown", blockInput, true);
    window.addEventListener("keypress", blockInput, true);
    window.addEventListener("keyup", blockInput, true);

    return () => {
      window.removeEventListener("click", blockInput, true);
      window.removeEventListener("mousedown", blockInput, true);
      window.removeEventListener("mouseup", blockInput, true);
      window.removeEventListener("keydown", blockInput, true);
      window.removeEventListener("keypress", blockInput, true);
      window.removeEventListener("keyup", blockInput, true);
    };

    }, [])

    return(
        <div className="spinner-container">
            <img src={images.refresh} alt="Refresh icon"/>
        </div>
    )
}

export default Spinner;