import React from "react";
import "./FaceRecognition.css";

function FaceRecognition({ imageUrl, boundingBox }) {
  return (
    <div className="ma center">
      <div className="absolute mt2">
        <div
          className="bounding-box"
          style={{
            top: boundingBox.topRow,
            right: boundingBox.rightCol,
            bottom: boundingBox.bottomRow,
            left: boundingBox.leftCol,
          }}
        ></div>
        <img
          id="inputImage"
          src={imageUrl}
          width="300px"
          height="auto"
          alt=""
        />
      </div>
    </div>
  );
}

export default FaceRecognition;
