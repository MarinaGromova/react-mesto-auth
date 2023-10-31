import React, { useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/Auth";
import successImage from "../images/union.svg";
import errorImage from "../images/error.svg";

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  // const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [renderLoading, setrenderLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [infoTooltip, setInfoTooltip] = useState(false);
  const [emailLogin, setEmailLogin] = useState(null);
  const [isImagePopup, setImagePopup] = useState("");
  const [isTitlePopup, setTitlePopup] = useState("");
  const navigate = useNavigate(); // хук, который позволяет управлять роутинком (тоже самое что навигейт, только не в разметке)

  //регистрация
  const handleRegister = ({password, email}) => {
    // console.log(password)
    // console.log(email)
    auth
      .register(password, email)
      .then(() => {
        setImagePopup(successImage);
        setTitlePopup("Вы успешно зарегистрировались!");
        navigate("/sign-in");
      })
      .catch(() => {
        setImagePopup(errorImage);
        setTitlePopup("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(handleInfoTooltip);
  };

  //запрос на авторизацию
  const handleLogin = ({password, email}) => {
    console.log(password)
    console.log(email)
    auth
      .authorize(password, email)
      .then((response) => {
        localStorage.setItem("jwt", response.token);
        setLoggedIn(true); //если есть jwt, то логинем
        setEmailLogin(email);
        navigate("/");
      })
      .catch(() => {
        setImagePopup(errorImage);
        setTitlePopup("Что-то пошло не так! Попробуйте ещё раз.");
        handleInfoTooltip();
      });
  };

  const onSignOut = () => {
    setLoggedIn(false);
    setEmailLogin(null);
    navigate("/sign-in");
    localStorage.removeItem("jwt");
  }


  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(jwt) {
      auth.tockenCheck(jwt).then((response) => {
        if(response) {
          setLoggedIn(true);
          setEmailLogin(response.data.email);
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }, []);

  
  useEffect(() => {
    if (loggedIn === true) {
      navigate("/");
    }
  }, [loggedIn, navigate]);


  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setrenderLoading(true);
    setSelectedCard({ name: card.name, link: card.link });
  };

  //информация
  const handleInfoTooltip = () => {
    setInfoTooltip(true);
  };

  const handleCardDelete = (cardId) => {
    api
      .deleteCard(cardId)
      .then(() => {
        setCards(cards.filter((c) => c._id !== cardId));
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setrenderLoading(false));
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (!isLiked) {
      api
        .handleLike(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => console.log(`Ошибка: ${err}`));
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => console.log(`Ошибка: ${err}`));
    }
  };

  const handleUpdateUser = (data) => {
    setrenderLoading(true);
    api
      .patchUserInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setrenderLoading(false));
  };

  const handleUpdateAvatar = (data) => {
    setrenderLoading(true);
    api
      .patchAvatarUrl(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setrenderLoading(false));
  };

  function handleAddPlaceSubmit(data) {
    setrenderLoading(true);
    api
      .postAddCard(data)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setrenderLoading(false));
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setSelectedCard(false);
    setInfoTooltip(false);
    // setIsDeletePopupOpen(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Routes>
            <Route
              path="/sign-up"
              element={
                <>
                  <Header title="Войти" route="/sign-in" />
                  <Register onRegister={handleRegister} />
                </>
              }
            />
            <Route
              path="/sign-in"
              element={
                <>
                  <Header title="Регистрация" route="/sign-up" />
                  <Login onLogin={handleLogin} />
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Header title="Выйти" route="/sign-in" mail = {emailLogin} onClick = {onSignOut} />
                  <ProtectedRoute
                    component={Main}
                    loggedIn={loggedIn}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onDeleteCard={handleCardDelete}
                  />
                  <Footer />
                </>
              }
            />
            <Route
              path="*"
              element={<Navigate to={loggedIn ? "/" : "/sign-in"} />}
            />
          </Routes>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            renderLoading={renderLoading ? "Сохранение..." : "Сохранить"}
          />
          <PopupWithForm
            // isOpen={isDeletePopupOpen}
            // onClose={closeAllPopups}
            title={"Вы уверены?"}
            buttonText={"Да"}
            name={"delete"}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            renderLoading={renderLoading ? "Сохранение..." : "Создать"}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            renderLoading={renderLoading ? "Сохранение..." : "Сохранить"}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip
            isOpen={infoTooltip}
            onClose={closeAllPopups}
            image={isImagePopup}
            title={isTitlePopup}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
