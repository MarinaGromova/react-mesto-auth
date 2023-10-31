import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(card) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `elements__group ${
    isLiked && "elements__group_active"
  }`;

  function handleClick() {
    card.onCardClick(card);
  }

  function handleDeleteClick() {
    card.onDeleteCard(card._id);
  }

  function handleCardLike() {
    card.onCardLike(card);
  }

  return (
    <>
      {isOwn && (
        <button
          type="button"
          aria-label="Закрыть"
          className="elements__basket"
          onClick={handleDeleteClick}
        ></button>
      )}
      <img
        onClick={handleClick}
        src={card.link}
        alt={card.name}
        className="elements__img"
      />
      <div className="elements__flex">
        <h2 className="elements__title">{card.name}</h2>
        <div className="elements__likes">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleCardLike}
          ></button>
          <p className="elements__likes-number">{card.likes.length}</p>
        </div>
      </div>
    </>
  );
}