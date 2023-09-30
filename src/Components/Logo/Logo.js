import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brain.png";

function Logo() {
  return (
    <div className="ma4 mt0 center flex justify-center">
      <div className="logo-container">
        <Tilt
          tiltMaxAngleX={30}
          tiltMaxAngleY={30}
          perspective={800}
          transitionSpeed={1500}
          gyroscope={true}
        >
          <div className="logo-content">
            <img src={brain} alt="logo" className=" pa4"></img>
          </div>
        </Tilt>
      </div>
    </div>
  );
}

export default Logo;
