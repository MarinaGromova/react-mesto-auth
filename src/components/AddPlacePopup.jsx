import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setlink] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({ name, link });
  }

  function handlePlaceName(e) {
    setName(e.target.value);
  }

  function handlePlaceLink(e) {
    setlink(e.target.value);
  }

  //сброс текста при открытии
  React.useEffect(() => {
    setName("");
    setlink("");
  }, [isOpen]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="profile"
      title="Новое место"
      buttonText="Создать"
    >
      <input
        name="name"
        id="input-new"
        className="popup__input popup__input_type_card"
        placeholder="Название"
        type="text"
        minLength="2"
        maxLength="30"
        required=""
        value={name || ""}
        onChange={handlePlaceName}
      />
      <span className="popup__input-error input-new-error" />
      <input
        name="link"
        id="input-link"
        className="popup__input popup__input_type_url"
        placeholder="Ссылка на картинку"
        type="url"
        required=""
        value={link || ""}
        onChange={handlePlaceLink}
      />
      <span className="popup__input-error input-link-error" />
    </PopupWithForm>
  );
}