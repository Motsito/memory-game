import React, { useEffect, useRef } from "react";
import "./timer.scss";

export default function Timer({ seconds, setSeconds, play, winLose }) {
  const timerId = useRef();

  useEffect(() => {
    if (play) {
      timerId.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId.current);
    }
  }, [play]);

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
