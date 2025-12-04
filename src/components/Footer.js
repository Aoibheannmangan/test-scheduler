import React from "react";
import uccLogo from "./../assets/uccFooter.png";
import "./Footer.css";

// Footer placed at the bottom of all pages
const Footer = () => {
  return (
		<div className="Footer">
			<div className="container-pair">
				<div className="box">
					<h2>Hosted at:</h2>
					<img src={uccLogo} alt="UccLogo" />
				</div>
				<div className="box">
					<h2>Contact:</h2>
					<p className="contact-info">
						Email: infant@ucc.ie
						<br />
						Tel: +353(0)21 4205082
						<br />
						<br />
						Paediatric Academic Unit, <br />
						Cork University Hospital, <br />
						Wilton, Cork
						<br />
						Ireland
					</p>
				</div>
			</div>
		</div>
  );
};

export default Footer;
