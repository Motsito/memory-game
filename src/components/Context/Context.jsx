import { createContext } from "react";

const Context = createContext({
  //context used to change between screens
  currentScreen: undefined,
  winLose: undefined,
  play: undefined,
  setPlay: () => {},
  setWinLose: () => {},
  setCurrentScreen: () => {},
});

export default Context;
