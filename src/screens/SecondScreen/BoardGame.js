import React, { useContext, useEffect, useState } from "react";
import SoundIcon from "../../components/SoundIcon/SoundIcon";
import comet from "../../assets/cards/comet.svg";
import moon from "../../assets/cards/moon.svg";
import star from "../../assets/cards/star.svg";
import sun from "../../assets/cards/sun.svg";
import stockCardIcon from "../../assets/icons/logo.svg";
import MatchModal from "../../components/MatchModal/MatchModal";
import Timer from "../../components/Timer/Timer";
import Context from "../../components/Context/Context";
import Button from "react-bootstrap/Button";
import "./BoardGame.scss";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BoardGame() {
  const { winLose, setWinLose, setCurrentScreen, sound, setSound } =
    useContext(Context);

  //begining with setting up cards and their proper card numbers
  const cardNames = [
    ["comet", comet],
    ["moon", moon],
    ["star", star],
    ["sun", sun],
  ];

  //we are going to use a group of 16 cards, 8 are going to have front data, and 8 have back data
  //"reversedCard" will only have, index, "default" name, and back card icon
  const reversedCards = Array.from({ length: 8 }, (_, index) => [
    index,
    "default",
    stockCardIcon,
  ]);
  const baseStatus = Array.from(
    { length: 8 },
    (_, index) => "unclickable card"
  );
  const playableStatus = Array.from({ length: 8 }, (_, index) => "card");

  //"currentDeck" let us pack the cards that are currently being played starts with a copy of reversed cards, but later on will have
  //data for the playable cards, this will change when pressing "play"
  const [currentDeck, setCurrentDeck] = useState(reversedCards);
  //deck status specifies the state of each card in the deck
  const [deckStatus, setDeckStatus] = useState(baseStatus);
  //if modal is true, modal shows
  const [modalStatus, setModalStatus] = useState(false);
  //alters depending if the dupla belongs to each other
  const [modalText, setModalText] = useState("");
  //this state will allow us to know wich cards have been flipped
  const [flippedCards, setFlippedCards] = useState([]);
  //this state will allow us to keep the dupla in control
  const [couple, setCouple] = useState(undefined);
  //sets the timer
  const [seconds, setSeconds] = useState(30);
  //starts the game
  const [play, setPlay] = useState(false);

  //winner decider
  useEffect(() => {
    //if every card is flipped, we have a winner
    if (flippedCards.length >= 8) {
      setPlay(false);
      setWinLose("You Won!!🎉🎉");
      setTimeout(() => {
        setCurrentScreen("end");
      }, 500);
      //if the timer reaches 0, we lose
    } else if (seconds <= 0) {
      setPlay(false);
      setWinLose("You Lost :(");
      setTimeout(() => {
        setCurrentScreen("end");
      }, 200);
    }
  }, [seconds, flippedCards]);

  //gets the modal to be shown and states the text to be displayed
  const handleModal = (text) => {
    setModalStatus(true);
    setModalText(text);
  };

  //class condition for the play button to change depending the game state
  const playCondition = play
    ? "unclickable game__button started"
    : "game__button";

  // function that will execute when pressing "play" and "restart"
  const getNewCards = () => {
    //CardPositions will have the setted card positions
    let CardPositions = [];

    //gameCards will keep the every card data before adjusting it
    let gameCards = [];

    //recursive function that will work until we have 8 of the needed cards
    function newCard() {
      //gets random number below 8
      let NewCardPosition = Math.floor(Math.random() * 8);
      //if we dont have 8 cards and the current index is in the array, we reset the function
      if (
        CardPositions.length < 8 &&
        CardPositions.indexOf(NewCardPosition) !== -1
      ) {
        newCard();
        //if the card is not in the array we introduce it to the new group
      } else if (CardPositions.indexOf(NewCardPosition) === -1) {
        CardPositions.push(NewCardPosition);
        newCard();
      }
    }
    newCard();

    //for each that will allow us to have the index for every card, after this, we sort the randomized numbers
    cardNames.forEach((card, index) => {
      for (let i = 0; i < 2; i++) {
        let sum = index === 1 ? 2 : index === 2 ? 4 : index === 3 ? 6 : 0;
        let currentCardIndex = sum + i;
        //final data for the card, [{index},{name},{icon}]
        gameCards.push([CardPositions[currentCardIndex], card[0], card[1]]);
      }
    });
    //sorted array gets returned
    gameCards = gameCards.sort((a, b) => a[0] - b[0]);
    return gameCards;
  };

  //function that will display the deck of cards
  const displayCards = () => {
    return currentDeck.map((card, i) => {
      return (
        <Button
          className={deckStatus[i]}
          key={card[0]}
          id={card[1]}
          onClick={() => handleFlip(card)}
        >
          <div className="card__side card__side-back">?</div>
          <div className="card__side card__side-shape">
            <img src={card[2]} alt="" />
          </div>
        </Button>
      );
    });
  };

  //function that executes getNewcards function
  const playButton = () => {
    setDeckStatus(playableStatus);
    setPlay(true);
    setCurrentDeck(getNewCards());
  };

  //toSpliced, allows me to return a copy of an array with one or multiples changes the format is: toSpliced("start","deleteCount", "item to insert")
  const changeCardStatus = (desiredState, card, boolean) => {
    //current Status gets established as the new state of cards, replacing the card that has been clicked
    let currentStatus = deckStatus.toSpliced(card[0], 1, desiredState);

    //makes the cards to be unclickable when animation is happening
    if (boolean) {
      let currentUnclickableStatus = currentStatus.map((status) => {
        return status + " unclickable";
      });
      setDeckStatus(currentUnclickableStatus);
      //timeouts allows cards to be clicked
      setTimeout(() => {
        setDeckStatus(currentStatus);
      }, 1000);
    } else {
      currentStatus = deckStatus.toSpliced(card[0], 1, "selected card");
      setDeckStatus(currentStatus);
      setTimeout(() => {
        deckStatus.forEach((status, index) => {
          if (flippedCards.indexOf(index) === -1) {
            currentStatus[index] = desiredState;
          }
        });
        setDeckStatus(currentStatus);
      }, 500);
    }
  };

  const handleFlip = (card) => {
    if (couple === undefined) {
      //changin card status to selected
      changeCardStatus("selected card", card, true);
      return setCouple(card);
    } else if (couple[1] === card[1]) {
      //dupla is correct and winners gets introduced in flipped cards
      let winners = [...flippedCards, couple[0], card[0]];
      handleModal("nice! it's a match");
      changeCardStatus("selected card", card, true);
      setFlippedCards(winners);
      setCouple(undefined);
    } else {
      //dupla is not correct
      handleModal("sorry, but this is not a match");
      changeCardStatus("not-selected card", card, false);
      setCouple(undefined);
    }
  };

  return (
    <div>
      <MatchModal
        modalStatus={modalStatus}
        modalText={modalText}
        setModalStatus={setModalStatus}
      />
      <div className="wallpaper">
        <div className="white-area">
          <Timer
            seconds={seconds}
            setSeconds={setSeconds}
            play={play}
            winLose={winLose}
          />
          <SoundIcon
            modalStatus={modalStatus}
            modalText={modalText}
            seconds={seconds}
            play={play}
            winLose={winLose}
            sound={sound}
            setSound={setSound}
          />
          <div className="game">
            <div className="game__area">{displayCards()}</div>
            <Button className={playCondition} onClick={() => playButton()}>
              play!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
