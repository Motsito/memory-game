import React, { useEffect, useState } from "react";
import "./SoundStyles.scss";
import SoundOn from "../../assets/icons/sound--on.svg";
import SoundOff from "../../assets/icons/sound--off.svg";
import Music from "../../assets/sounds/background.mp3";

export default function SoundIcon() {
  // "sound" will allow us to manipulate the background music status in the interaction
  const [sound, setSound] = useState(false);
  // setting the music as a state was needed in order to play the music propertly
  const [backgroundMusic, setBackgroundMusic] = useState(new Audio(Music));

  // this use effect allows "sound" to be the key for the component, since "soundIcon" return, works with a condition, if "true" icon changes and music starts playing
  useEffect(() => {
    if (sound) {
      backgroundMusic.load();
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  }, [sound]);

  return (
    <div className="soundIcon" onClick={() => setSound(() => !sound)}>
      {sound ? (
        <button
          onClick={() => {
            setSound(!sound);
          }}
        >
          {" "}
          <img src={SoundOn} alt="Sound On" />
        </button>
      ) : (
        <button
          onClick={() => {
            setSound(!sound);
          }}
        >
          <img src={SoundOff} alt="Sound OFF" />
        </button>
      )}
    </div>
  );
}
