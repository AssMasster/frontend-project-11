import { validateUrl } from "../lib/validator.js";

export function initController(watchedState, i18nInstance) {
  // Функция-обработчик отправки формы
  function handleFormSubmit(url) {
    const existingUrls = watchedState.feeds.map((feed) => feed.url);
    watchedState.form.status = "validating";
    watchedState.form.errors = [];

    validateUrl(url, existingUrls, i18nInstance)
      .then((validUrl) => {
        watchedState.form.status = "success";
        watchedState.feeds.push({
          url: validUrl,
          name: "New Feed", // заглушка
          description: "Description", // заглушка
          dateAdded: new Date().toISOString(),
        });
        // TODO: добавить фид в feeds
      })
      .catch((error) => {
        // 4. ОШИБКА
        watchedState.form.status = "error";
        watchedState.form.valid = false;
        watchedState.form.errors.push(error.message);
      });
  }

  return {
    handleFormSubmit, // экспортируем метод наружу
  };
}
