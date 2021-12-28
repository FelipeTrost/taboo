import { useEffect, useRef, useState } from "react";

function useCards(cards) {
  const cardRef = useRef(
    Object.keys(cards)
      .map((key) => cards[key].cards)
      .flat()
  );

  const [currentCard, setCurrentCard] = useState();

  function getCard() {
    if (cardRef.current.length == 0) {
      alert("no more cards");
      return null;
    }

    const index = Math.trunc(Math.random() * cardRef.current.length);
    const card = cardRef.current[index];
    cardRef.current = cardRef.current.filter((_, i) => i != index);

    setCurrentCard(card);
    return true;
  }

  return [getCard, currentCard];
}

export default useCards;
