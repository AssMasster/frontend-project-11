import { state } from "../app/state.js";
import onChange from "on-change";

export function initView(state) {
  const watchedState = onChange(state, (path, value, oldValue) => {
    console.log("State изменился:", path, "было", oldValue, "стало", value);

    if (path === "form.status") {
      updateFormStatus(value);
    }
    if (path === "form.valid") {
      updateInputValidity(value);
    }
    if (path === "form.errors") {
      updateErrorDisplay(value);
    }
    if (path === "feeds") {
      handleNewFeedAdded();
    }
  });

  function updateFormStatus(value) {
    const input = document.querySelector("#rss-url");
    const button = document.querySelector("#rss-form button");

    switch (value) {
      case "validating":
        input.disabled = true;
        button.textContent = "Checking...";
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
        button.textContent = "Add RSS";
        break;
      default:
        input.disabled = false;
        button.textContent = "Add RSS";
    }
  }

  function updateInputValidity(isValid) {
    const input = document.querySelector("#rss-url");
    if (isValid) {
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
    }
  }

  function updateErrorDisplay(errors) {
    // TODO: показать ошибки пользователю
  }

  function handleNewFeedAdded() {
    // TODO: обновить список фидов
  }

  return watchedState;
}
