import { createContext } from "react";

const Context = createContext({
  currentScreen: undefined,
  winLose: undefined,
  setWinLose: () => {},
  setCurrentScreen: () => {},
});

export default Context;
