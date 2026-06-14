export const WEB_URL = (process.env.EXPO_PUBLIC_WEB_URL || "http://timerbook.com.br").replace(/\/+$/, "");

export const tabs = [
  { key: "home", label: "Inicio" },
  { key: "library", label: "Livros" },
  { key: "newBook", label: "Novo" },
  { key: "profile", label: "Perfil" }
];

export const initialBookForm = {
  name: "",
  description: "",
  cover: null,
  pdf: null
};
