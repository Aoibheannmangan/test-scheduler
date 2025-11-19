import React from "react";
import uccLogo from "./../assets/uccFooter.png";
import "./Footer.css";

// Footer placed at the bottom of all pages
const Footer = () => {
  return (
    <div className="Footer">
      <hr />
      <h3>Hosted at</h3>
      <img src={uccLogo} alt="UccLogo" />
    </div>
  );
};

export default Footer;
