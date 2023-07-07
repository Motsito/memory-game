import React, { useContext, useEffect, useRef } from "react";
import Context from "../Context/Context.jsx";
import "./timer.scss";

export default function Timer({ seconds, setSeconds, winLose }) {
  const timerId = useRef();

  const { play } = useContext(Context);

  useEffect(() => {
    //avoids counter start if play is not true
    if (play) {
      timerId.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId.current);
    }
  }, [play]);

  //stops counter at 0
  useEffect(() => {
    if (seconds <= 0) {
      clearInterval(timerId.current);
    }
  }, [seconds]);

  //gamestoper
  useEffect(() => {
    clearInterval(timerId.current);
  }, [winLose]);

  return (
    <div className="Timer">
      <h1>Time: {seconds}</h1>
    </div>
  );
}
