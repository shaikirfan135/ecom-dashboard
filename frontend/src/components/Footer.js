import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return(
        <div className="footer">
            <h3>copyrights and published by irfan {currentYear}</h3>
        </div>
    )
}

export default Footer;