export const BaseUrl = "https://auth.nomoreparties.co";

//запрос для регистрации
export const register = (password, email) => {
  return fetch(`${BaseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({password, email}),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  });
};

//запрос для авторизации
export const authorize = (password, email) => {
  return fetch(`${BaseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({password, email}),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(`Ошибка: ${response.status}`);
  });
};

//проверка актуальности токена
export const tockenCheck = (jwt) => {
  return fetch(`${BaseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  }).then((response) => {
    return response.json();
  });
};
