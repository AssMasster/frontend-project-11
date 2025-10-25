import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { state } from "./app/state.js";
import { initView } from "./view/view.js";
import { initController } from "./app/controller.js";
import { initI18n } from "./app/i18n.js";

initI18n()
  .then((i18nInstance) => {
    console.log("i18n готов, создаём приложение...");

    const watchedState = initView(state, i18nInstance);
    const controller = initController(watchedState, i18nInstance);

    renderApp(i18nInstance);
    setupEventListeners(controller, watchedState);

    window.i18n = i18nInstance;
    window.watchedState = watchedState;
  })
  .catch((error) => {
    console.log("не удалось инициализировать", error);
  });

function renderApp(i18nInstance) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="container mt-5">
      <div class="text-end mb-3">
        <div class="btn-group" role="group">
          <button type="button" class="btn btn-outline-primary" data-lng="en">
            ${i18nInstance.t("languages.en")}
          </button>
          <button type="button" class="btn btn-outline-primary" data-lng="ru">
            ${i18nInstance.t("languages.ru")}
          </button>
        </div>
      </div>
      
      <h1>${i18nInstance.t("ui.title")}</h1>
      <form id="rss-form" class="mt-4" novalidate>
        <div class="mb-3">
          <label for="rss-url" class="form-label">${i18nInstance.t(
            "ui.urlLabel"
          )}</label>
          <input type="url" class="form-control" id="rss-url" name="input" 
                 placeholder="${i18nInstance.t("ui.urlPlaceholder")}">
        </div>
        <button type="submit" class="btn btn-primary">${i18nInstance.t(
          "ui.submitButton"
        )}</button>
      </form>
      <div id="feed-container" class="mt-4">
        <h2>Фиды</h2>
        <div class="feeds-list"></div>
      </div>
      <div id="posts-container">
        <h2>Посты</h2>
        <div class="posts-list"></div>
      </div>
    </div>
  `;
}

function setupEventListeners(controller, watchedState) {
  document.getElementById("rss-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get("input");
    controller.handleFormSubmit(url);
  });
  document.querySelectorAll("[data-lng]").forEach((button) => {
    button.addEventListener("click", (e) => {
      const lng = e.target.dataset.lng;
      watchedState.ui.lng = lng;
    });
  });
}
