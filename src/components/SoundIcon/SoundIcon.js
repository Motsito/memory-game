import React, { useEffect, useState } from "react";
import "./SoundStyles.scss";
import SoundOn from "../../assets/icons/sound--on.svg";
import SoundOff from "../../assets/icons/sound--off.svg";
import Music from "../../assets/sounds/background.mp3";
import Match from "../../assets/sounds/correct.mp3";
import notMatch from "../../assets/sounds/incorrect.mp3";
import ticking from "../../assets/sounds/ticking.mp3";

export default function SoundIcon({
  modalStatus,
  modalText,
  seconds,
  play,
  winLose,
}) {
  // "sound" will allow us to manipulate the background music status in the interaction
  const [sound, setSound] = useState(false);
  // setting the music as a state was needed in order to play the music propertly
  const [backgroundMusic, setBackgroundMusic] = useState(new Audio(Music));
  const matchSound = new Audio(Match);
  const notMatchSound = new Audio(notMatch);
  const tickingSound = new Audio(ticking);

  // this use effect allows "sound" to be the key for the component, since "soundIcon" return, works with a condition, if "true" icon changes and music starts playing

  //match or not match sound
  useEffect(() => {
    if (sound && modalStatus) {
      modalText === "sorry, but this is not a match"
        ? notMatchSound.play()
        : matchSound.play();
    }
  }, [modalStatus]);

  //music sound
  useEffect(() => {
    if (sound) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  }, [sound]);

  //starts game and play at the same time
  useEffect(() => {
    if (!play) {
      setSound(false);
    } else {
      setSound(true);
    }
  }, [play]);

  //starts ticking at 10seconds
  useEffect(() => {
    if (sound && seconds <= 10 && seconds > 0) {
      tickingSound.play();
    } else if (seconds === 0) {
      setSound(false);
    }
  }, [seconds]);

  return (
    <div className="soundIcon">
      {sound ? (
        <button onClick={() => setSound(!sound)}>
          {" "}
          <img src={SoundOn} alt="Sound On" />
        </button>
      ) : (
        <button onClick={() => setSound(!sound)}>
          <img src={SoundOff} alt="Sound OFF" />
        </button>
      )}
    </div>
  );
}
