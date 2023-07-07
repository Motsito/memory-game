import { useState } from "react";
import Start from "./screens/FirstScreen/Start";
import BoardGame from "./screens/SecondScreen/BoardGame";
import Context from "./components/Context/Context.jsx";
import End from "./screens/ThirdScreen/End.jsx";

function App() {
  const [currentScreen, setCurrentScreen] = useState(undefined);
  const [winLose, setWinLose] = useState(undefined);

  return (
    <Context.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        winLose,
        setWinLose,
      }}
    >
      {currentScreen === "end" ? (
        <End />
      ) : currentScreen === "game" ? (
        <BoardGame />
      ) : (
        <Start />
      )}
    </Context.Provider>
  );
}

export default App;
