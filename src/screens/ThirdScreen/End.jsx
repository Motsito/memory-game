import React, { useContext, useState } from "react";
import { ReactComponent as ReactLogo } from "../../assets/icons/logo.svg";
import "../FirstScreen/Start.scss";
import Context from "../../components/Context/Context";

export default function End() {
  const { currentScreen, setCurrentScreen, winLose } = useContext(Context);
  const [animate, setAnimate] = useState(true);

  const handleChangeScreen = () => {
    setCurrentScreen("game");
    console.log(currentScreen);
  };

  return (
    <div className="initial-view-container">
      <div className="content">
        <div className="result">{winLose}</div>
        <button
          className={`start-button ${animate ? "animate" : ""}`}
          onMouseEnter={() => setAnimate(false)}
          onClick={handleChangeScreen}
        >
          Play Again!
        </button>
      </div>
    </div>
  );
}
