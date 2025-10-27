import axios from "axios";

export function getRss(rssUrl) {
  const encodedUrl = encodeURIComponent(rssUrl);
  const urlSpecial = `https://allorigins.hexlet.app/get?url=${encodedUrl}&disableCache=true`;

  return axios({
    method: "get",
    url: urlSpecial,
    timeout: 10000,
  })
    .then(function (response) {
      console.log("Полный ответ от All Origins:", response.data);

      if (response.data && response.data.contents) {
        return response.data.contents;
      } else {
        console.error("Неожиданная структура ответа:", response.data);
        throw new Error("Invalid response format from All Origins");
      }
    })
    .catch((error) => {
      console.error("Ошибка загрузки RSS:", error);

      if (error.response) {
        throw new Error(`Ошибка сервера: ${error.response.status}`);
      } else if (error.request) {
        throw new Error("Ошибка сети");
      } else {
        throw new Error(`Ошибка запроса: ${error.message}`);
      }
    });
}
