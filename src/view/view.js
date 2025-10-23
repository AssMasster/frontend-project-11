import { state } from "../app/state.js";
import onChange from "on-change";

export function initView(state, i18Instance) {
  renderInitialTexts(i18Instance);

  const watchedState = onChange(state, (path, value, oldValue) => {
    console.log("State изменился:", path, "было", oldValue, "стало", value);

    if (path === "form.status") {
      updateFormStatus(value, i18Instance);
    }
    if (path === "form.valid") {
      updateInputValidity(value);
    }
    if (path === "form.errors") {
      updateErrorDisplay(value, i18Instance);
    }
    if (path === "feeds") {
      handleNewFeedAdded();
    }

    if (path === "ui.lng") {
      i18Instance.changeLanguage(value).then(() => {
        renderAllTexts(i18Instance);
        updateLanguageButtons(value);
      });
    }
  });

  function renderAllTexts(i18n) {
    const elements = {
      h1: "ui.title",
      'label[for="rss-url"]': "ui.urlLabel",
      "#rss-url": "ui.urlPlaceholder",
      '#rss-form button[type="submit"]': "ui.submitButton",
      '[data-lng="en"]': "languages.en",
      '[data-lng="ru"]': "languages.ru",
    };

    Object.entries(elements).forEach(([selector, key]) => {
      const element = document.querySelector(selector);
      if (element) {
        if (selector === "#rss-url") {
          element.placeholder = i18n.t(key);
        } else {
          element.textContent = i18n.t(key);
        }
      }
    });
  }

  function updateLanguageButtons(activeLng) {
    document.querySelectorAll("[data-lng]").forEach((button) => {
      const isActive = button.dataset.lng === activeLng;
      button.classList.toggle("btn-primary", isActive);
      button.classList.toggle("btn-outline-primary", !isActive);
    });
  }

  function updateFormStatus(value, i18n) {
    const input = document.querySelector("#rss-url");
    const button = document.querySelector("#rss-form button");

    switch (value) {
      case "validating":
        input.disabled = true;
        button.textContent = i18n.t("ui.checkingButton");
        break;
      case "success":
        input.disabled = false;
        input.value = "";
        input.focus();
        setTimeout(() => {
          watchedState.form.status = "filling";
        }, 100);
        break;
      case "error":
        input.disabled = false;
        button.textContent = i18n.t("ui.submitButton");
        break;
      default:
        input.disabled = false;
        button.textContent = i18n.t("ui.submitButton");
    }
  }

  function renderInitialTexts(i18n) {
    const title = document.querySelector("h1");
    const label = document.querySelector('label[for="rss-url"]');
    const input = document.querySelector("#rss-url");
    const button = document.querySelector("#rss-form button");

    if (title) title.textContent = i18n.t("ui.title");
    if (label) label.textContent = i18n.t("ui.urlLabel");
    if (input) input.placeholder = i18n.t("ui.urlPlaceholder");
    if (button) button.textContent = i18n.t("ui.submitButton");
  }

  function updateInputValidity(isValid) {
    const input = document.querySelector("#rss-url");
    if (isValid) {
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
    }
  }

  function updateErrorDisplay(errors, i18n) {
    // TODO: показать ошибки пользователю
  }

  function handleNewFeedAdded() {
    // TODO: обновить список фидов
  }

  return watchedState;
}
