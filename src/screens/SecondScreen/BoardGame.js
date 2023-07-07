import React, { useContext, useEffect, useState } from "react";
import SoundIcon from "../../components/SoundIcon/SoundIcon";
import stockCardIcon from "../../assets/icons/logo.svg";
import MatchModal from "../../components/MatchModal/MatchModal";
import Timer from "../../components/Timer/Timer";
import Context from "../../components/Context/Context";
import chessKnight from "../../assets/cards/NewIcons/chess-knight-solid.svg";
import faceGrin from "../../assets/cards/NewIcons/face-grin-stars-solid.svg";
import guitar from "../../assets/cards/NewIcons/guitar-solid.svg";
import spock from "../../assets/cards/NewIcons/hand-spock-solid.svg";
import jedi from "../../assets/cards/NewIcons/jedi-solid.svg";
import meteor from "../../assets/cards/NewIcons/meteor-solid.svg";
import military from "../../assets/cards/NewIcons/person-military-pointing-solid.svg";
import shop from "../../assets/cards/NewIcons/shop-solid.svg";
import newSun from "../../assets/cards/NewIcons/sun-solid.svg";
import umbrella from "../../assets/cards/NewIcons/umbrella-solid.svg";
import astronaut from "../../assets/cards/NewIcons/user-astronaut-solid.svg";
import wand from "../../assets/cards/NewIcons/wand-magic-sparkles-solid.svg";

import "./BoardGame.scss";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BoardGame() {
  const { winLose, setWinLose, setCurrentScreen, sound, setSound } =
    useContext(Context);

  //begining with setting up cards and their proper card numbers

  const cardNames = [
    ["chessKnight", chessKnight],
    ["faceGrin", faceGrin],
    ["guitar", guitar],
    ["spock", spock],
    ["jedi", jedi],
    ["meteor", meteor],
    ["military", military],
    ["shop", shop],
    ["newSun", newSun],
    ["umbrella", umbrella],
    ["astronaut", astronaut],
    ["wand", wand],
  ];

  //we are going to use a group of 16 cards, 24 are going to have front data, and 24 have back data
  //"reversedCard" will only have, index, "default" name, and back card icon
  const reversedCards = Array.from({ length: 24 }, (_, index) => [
    index,
    "default",
    stockCardIcon,
  ]);
  const baseStatus = Array.from(
    { length: 24 },
    (_, index) => "unclickable card"
  );
  const playableStatus = Array.from({ length: 24 }, (_, index) => "card");

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
  const [play, setPlay] = useState(false);
  const [seconds, setSeconds] = useState(30);

  //winner decider
  useEffect(() => {
    //if every card is flipped, we have a winner
    if (flippedCards.length >= 24) {
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
      }, 240);
    }
  }, [seconds, flippedCards]);

  useEffect(() => {
    setPlay(true);
    setDeckStatus(playableStatus);
    setCurrentDeck(getNewCards());
  }, []);

  //gets the modal to be shown and states the text to be displayed
  const handleModal = (text) => {
    setModalStatus(true);
    setModalText(text);
  };

  // function that will execute when pressing "play" and "restart"
  const getNewCards = () => {
    //CardPositions will have the setted randomized card positions
    let CardPositions = [];

    //gameCards will keep the every card data before adjusting it
    let gameCards = [];

    //recursive function that will work until we have 24 randomized card positions
    function newCard() {
      //gets random number below 24
      let NewCardPosition = Math.floor(Math.random() * 24);
      //if we dont have 24 cards and the current index is in the array, we reset the function
      if (
        CardPositions.length < 24 &&
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
    CardPositions.forEach(() => {});
    cardNames.forEach((card, index) => {
      for (let i = 0; i < 2; i++) {
        let sum = index === 1 ? 2 : index * 2;
        let currentCardIndex = sum + i;
        //final data for the card, [{index},{name},{icon}]
        gameCards.push([CardPositions[currentCardIndex], card[0], card[1]]);
      }
    });
    //sorted array gets returned
    gameCards = gameCards.sort((a, b) => a[0] - b[0]);
    return gameCards;
  };

  const handleFlip = (card) => {
    console.log({ currentDeck });
    if (couple === undefined) {
      //changin card status to selected
      changeCardStatus("unclickable selected card", card, true);
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

  //function that will display the deck of cards
  const displayCards = () => {
    return currentDeck.map((card, i) => {
      return (
        <button
          className={deckStatus[i]}
          key={i}
          id={card[1]}
          onClick={() => handleFlip(card)}
        >
          <div className="card__side card__side-back">?</div>
          <div className="card__side card__side-shape">
            <img src={card[2]} alt="" />
          </div>
        </button>
      );
    });
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
      }, 300);
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

  return (
    <div>
      <MatchModal
        modalStatus={modalStatus}
        modalText={modalText}
        setModalStatus={setModalStatus}
      />
      <div className="wallpaper">
        <div className="white-area">
          <Timer seconds={seconds} setSeconds={setSeconds} play={play} />
          <SoundIcon
            modalStatus={modalStatus}
            modalText={modalText}
            play={play}
            winLose={winLose}
            sound={sound}
            setSound={setSound}
          />
          <div className="game">
            <div className="game__area">{displayCards()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
