import React from 'react';
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = React.useRef();
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);
  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="avatar"
      title="Обновить аватар"
      buttonText="Сохранить">
      <input
        name="link"
        // id="input-link"
        className="popup__input popup__input_type_url popup__container-title_margin"
        placeholder="Ссылка на картинку"
        type="url"
        required=""
        ref={avatarRef}
      />
      <span className="popup__input-error input-link-error popup__container-margin" />
    </PopupWithForm>
  );
}