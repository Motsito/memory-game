import React, { useState } from "react";
import comet from "../../assets/cards/comet.svg";
import moon from "../../assets/cards/moon.svg";
import star from "../../assets/cards/star.svg";
import sun from "../../assets/cards/sun.svg";

export default function BoardGame() {
  //begining with setting up cards and their proper card numbers
  const cardIcons = [comet, moon, star, sun];
  //"currentCards" let us pack the cards that are currently being played
  const [currentCards, setCurrentCards] = useState(undefined);

  // function that will execute when pressing "play" and "restart"
  const getNewCards = () => {
    //CardPositions will have the setted card positions
    let CardPositions = [];

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

    let gameCards = [];

    cardIcons.forEach((card, index) => {
      for (let i = 0; i < 2; i++) {
        let sum = index === 1 ? 2 : index === 2 ? 4 : index === 3 ? 6 : 0;
        let currentCardIndex = sum + i;
        gameCards.push([CardPositions[currentCardIndex], card]);
      }
    });
    setCurrentCards(gameCards.sort((a, b) => a[0] - b[0]));
    console.log(currentCards);
  };

  getNewCards();
  return <div>aye sir</div>;
}
