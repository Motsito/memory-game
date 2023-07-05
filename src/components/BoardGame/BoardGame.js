import React, { useState } from "react";
import SoundIcon from "../SoundIcon/SoundIcon";
import comet from "../../assets/cards/comet.svg";
import moon from "../../assets/cards/moon.svg";
import star from "../../assets/cards/star.svg";
import sun from "../../assets/cards/sun.svg";
import stockCardIcon from "../../assets/icons/logo.svg";
import "./BoardGame.scss";
import MatchModal from "../MatchModal/MatchModal";
import Timer from "../Timer/Timer";

export default function BoardGame() {
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
    (_, index) => "not-selected card"
  );

  //"currentDeck" let us pack the cards that are currently being played starts with a copy of reversed cards, but later on will have
  //data for the playable cards, this will change when pressing "play"
  const [currentDeck, setCurrentDeck] = useState(reversedCards);
  const [deckStatus, setDeckStatus] = useState(baseStatus);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalText, setModalText] = useState("");

  const handleModal = (text) => {
    setModalStatus(true);
    setModalText(text);
  };

  //this state will allow us to know wich cards have been flipped
  const [flippedCards, setFlippedCards] = useState([]);
  //this state will allow us to keep the dupla in control
  const [couple, setCouple] = useState(undefined);

  // const conditionalClass = (card) =>
  //   //if card exist in flipped cards, or card is equal to couple, they are selected
  //   flippedCards.indexOf(card) !== -1 || card === couple
  //     ? "selected card"
  //     : "not-selected card";

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

  //function that will display "reversedCards" and "currentDeck", [0=index, 1=name, 2=icon]
  const displayCards = () => {
    return currentDeck.map((card, i) => {
      return (
        <button
          className={deckStatus[i]}
          key={card[0]}
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

  //function that executes getNewcards function
  const playButton = () => {
    setCurrentDeck(getNewCards());
  };

  //toSpliced, allows me to return a copy of an array with one or multiples changes the format is: toSpliced("start","deleteCount", "item to insert")
  const changeCardStatus = (desiredState, card, boolean) => {
    let currentStatus = deckStatus.toSpliced(card[0], 1, desiredState);
    if (boolean) {
      let currentUnclickableStatus = currentStatus.map((status) => {
        return status + " unclickable";
      });
      setDeckStatus(currentUnclickableStatus);
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
      }, 50);
    }
  };

  const handleFlip = (card) => {
    if (couple === undefined) {
      //changin card status to selected
      changeCardStatus("selected card", card, true);
      return setCouple(card);
    } else if (couple[1] === card[1]) {
      let winners = [...flippedCards, couple[0], card[0]];
      handleModal("nice! it's a match");
      changeCardStatus("selected card", card, true);
      setFlippedCards(winners);
      setCouple(undefined);
    } else {
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
      <div className="backGameArea">
        <Timer />
        <SoundIcon />
        <div className="whiteArea">
          <div>
            <div className="gameArea">{displayCards()}</div>
            <button onClick={() => playButton()}>play!</button>
          </div>
        </div>
      </div>
    </div>
  );
}
