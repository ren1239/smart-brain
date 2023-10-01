import React, { useState } from "react";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import ParticlesBg from "particles-bg";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [boundingBox, setBoundingBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const resetState = () => {
    setInput("");
    setImageUrl("");
    setBoundingBox({});
    setRoute("signin");
    setIsSignedIn(false);
    setUser({
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    });
  };

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const calculateFaceLocation = (data) => {
    console.log("Input data:", data);
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (boundingBox) => {
    console.log("boundingBox", boundingBox);
    setBoundingBox(boundingBox);
    // setIsImageVisible(true);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
    setImageUrl(event.target.value);
    // setIsImageVisible(false);
    setBoundingBox({});
  };
  const onSubmit = async () => {
    setImageUrl(input);
    // Send the image URL to your backend for Clarifai API processing
    try {
      const response = await fetch(
        "https://brain-backend-ubi3.onrender.com/clarifai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: input,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();

      // Call displayFaceBox with the calculated bounding box
      displayFaceBox(calculateFaceLocation(result));

      // Update user entries - You may need to adjust this part based on your backend response
      // setUser(Object.assign(user, { entries: count }));

      const imageResponse = await fetch(
        "https://brain-backend-ubi3.onrender.com/image",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id,
          }),
        }
      );
      const imageResult = await imageResponse.json();

      if (imageResponse.ok) {
        setUser((prevState) => ({
          ...prevState,
          entries: imageResult, // Adjust this based on your backend response
        }));
        console.log("result:", imageResult);
        console.log("result entries:", imageResult.entries);
      } else if (!imageResponse.ok) {
        throw new Error("Failed to update entries in the backend");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      // setIsSignedIn(false);
      resetState();
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <ParticlesBg
        className="background"
        type="cobweb"
        bg={true}
        color="#FFFFFF"
        num={300}
      />

      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <div>
          <Rank name={user.name} entries={user.entries} />
          <Logo />
          <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
          <FaceRecognition imageUrl={imageUrl} boundingBox={boundingBox} />
        </div>
      ) : route === "register" ? (
        <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      ) : (
        <SignIn onRouteChange={onRouteChange} loadUser={loadUser} />
      )}
    </div>
  );
}

export default App;
