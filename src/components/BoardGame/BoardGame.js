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

  const [currentCards, setCurrentCards] = useState(
    Array.from({ length: 8 }, (_, index) => [index, "default", stockCardIcon])
  );

  //"Deck" let us pack the cards that are currently being played
  const [deck, setDeck] = useState([]);

  // function that will execute when pressing "play" and "restart"
  const getNewCards = () => {
    //CardPositions will have the setted card positions
    let CardPositions = [];
    let gameCards = [];

    function newCard() {
      let NewCardPosition = Math.floor(Math.random() * 8);
      if (
        CardPositions.length < 8 &&
        CardPositions.indexOf(NewCardPosition) !== -1
      ) {
        newCard();
      } else if (CardPositions.indexOf(NewCardPosition) === -1) {
        CardPositions.push(NewCardPosition);
        newCard();
      }
    }
    newCard();

    cardNames.forEach((card, index) => {
      for (let i = 0; i < 2; i++) {
        let sum = index === 1 ? 2 : index === 2 ? 4 : index === 3 ? 6 : 0;
        let currentCardIndex = sum + i;
        gameCards.push([CardPositions[currentCardIndex], card[0], card[1]]);
      }
    });
    gameCards = gameCards.sort((a, b) => a[0] - b[0]);
    return gameCards;
  };

  const flipCard = (card) => {
    let newArray = deck.filter((item) => {
      return item[0] === card[0];
    });
    let newRorai = currentCards.filter((item) => {
      return item[0] !== card[0];
    });
    newRorai.push(newArray[0]);
    newRorai.sort((a, b) => {
      return a[0] - b[0];
    });
    console.log(newRorai);
    setCurrentCards(newRorai);
  };

  const displayCards = (cardGroup) => {
    return cardGroup.map((card) => {
      return (
        <button
          className="gameSlot flip"
          key={card[0]}
          id={card[1]}
          onClick={() => flipCard(card)}
        >
          <img src={card[2]} alt="" />
        </button>
      );
    });
  };

  const playButton = () => {
    setDeck(getNewCards());
    console.log(deck);
  };

  getNewCards();
  return (
    <div>
      <button onClick={() => playButton()}>get cards</button>
      <SoundIcon />
      <div className="gameZone">{displayCards(currentCards)}</div>
    </div>
  );
}
