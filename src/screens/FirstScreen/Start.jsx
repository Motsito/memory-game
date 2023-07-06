import React, { useContext, useState } from "react";
import { ReactComponent as ReactLogo } from "../../assets/icons/logo.svg";
import "./Start.scss";
import Context from "../../components/Context/Context";

export default function Start() {
  const { currentScreen, setCurrentScreen } = useContext(Context);
  const [animate, setAnimate] = useState(true);

  return (
    <div className="initial-view-container">
      <div className="content">
        <div className="logo">
          <ReactLogo />
        </div>
        <button
          className={`start-button ${animate ? "animate" : ""}`}
          onMouseEnter={() => setAnimate(false)}
          onClick={() => setCurrentScreen("game")}
        >
          Start
        </button>
      </div>
    </div>
  );
}
