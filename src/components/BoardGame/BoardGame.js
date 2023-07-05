import React, { useState } from "react";
import SoundIcon from "../SoundIcon/SoundIcon";
import comet from "../../assets/cards/comet.svg";
import moon from "../../assets/cards/moon.svg";
import star from "../../assets/cards/star.svg";
import sun from "../../assets/cards/sun.svg";
import stockCardIcon from "../../assets/icons/logo.svg";
import "./BoardGame.scss";

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

  //"currentDeck" let us pack the cards that are currently being played starts with a copy of reversed cards, but later on will have
  //data for the playable cards, this will change when pressing "play"
  const [currentDeck, setCurrentDeck] = useState(reversedCards);

  //this state will allow us to know wich cards have been flipped
  const [flippedCards, setFlippedCards] = useState([]);
  //this state will allow us to keep the dupla in control
  const [couple, setCouple] = useState(undefined);

  const conditionalClass = (card) =>
    //if card exist in flipped cards, or card is equal to couple, they are selected
    flippedCards.indexOf(card) !== -1 || card === couple
      ? "selected gameSlot"
      : "notSelected gameSlot";

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
  const displayCards = (cardGroup) => {
    return cardGroup.map((card) => {
      return (
        <button
          className={conditionalClass(card)}
          key={card[0]}
          id={card[1]}
          onClick={() => handleFlip(card)}
        >
          {cardGroup === currentDeck ? <img src={card[2]} alt="" /> : "?"}
        </button>
      );
    });
  };

  //function that executes getNewcards function
  const playButton = () => {
    setCurrentDeck(getNewCards());
  };

  const handleFlip = (card) => {
    if (couple === undefined) {
      return setCouple(card);
    } else if (couple[1] === card[1]) {
      let winners = [...flippedCards, couple, card];
      setFlippedCards(winners);
      setCouple(undefined);
    } else {
      console.log("wrong");
      setCouple(undefined);
    }
  };
  return (
    <div>
      <button onClick={() => playButton()}>get cards</button>
      <SoundIcon />
      <div className="gameZone">{displayCards(currentDeck)}</div>
      <div className="gameZone">{displayCards(reversedCards)}</div>
    </div>
  );
}
