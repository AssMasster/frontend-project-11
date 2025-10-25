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
      handleNewFeedAdded(value);
    }
    if (path === "loading.status") {
      handleLoadingStatus();
    }
    if (path === "posts") {
      handleNewPostAdded(value);
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
    const feedbackElement = document.querySelector(".feedback");
    if (!feedbackElement) return;

    if (errors.length > 0) {
      feedbackElement.textContent = errors[errors.length - 1];
      feedbackElement.classList.add("text-danger");
      feedbackElement.classList.remove("text-success");
    } else {
      feedbackElement.textContent = "";
      feedbackElement.classList.remove("text-danger", "text-success");
    }
  }

  function handleNewFeedAdded(feeds) {
    const feedContainer = document.querySelector(".feeds-list");
    if (!feedContainer) {
      console.error("❌ Не найден .feeds-list контейнер");
      return;
    }

    // Очищаем и перерисовываем все фиды
    feedContainer.innerHTML = "";

    feeds.forEach((feed) => {
      const feedElement = document.createElement("div");
      feedElement.className = "feed-item mb-3 p-3 border rounded";

      const h3 = document.createElement("h3");
      h3.className = "h5";
      h3.textContent = feed.title;

      const pDescription = document.createElement("p");
      pDescription.className = "text-muted mb-0";
      pDescription.textContent = feed.description;

      feedElement.append(h3, pDescription);
      feedContainer.append(feedElement);
    });

    console.log(`✅ Отрисовано фидов: ${feeds.length}`);
  }

  function handleNewPostAdded(posts) {
    const postsContainer = document.querySelector(".posts-list");
    if (!postsContainer) {
      console.error("❌ Не найден .posts-list контейнер");
      return;
    }

    // Очищаем и перерисовываем все посты
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post-item mb-3 p-3 border rounded";

      const h3 = document.createElement("h3");
      h3.className = "h6";
      h3.textContent = post.title;

      const link = document.createElement("a");
      link.href = post.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "d-block mb-2";
      link.textContent = post.link;

      const pDescription = document.createElement("p");
      pDescription.className = "text-muted small mb-0";
      pDescription.textContent = post.description;

      postElement.append(h3, link, pDescription);
      postsContainer.append(postElement);
    });

    console.log(`✅ Отрисовано постов: ${posts.length}`);
  }

  function handleLoadingStatus() {
    const status = watchedState.loading.status;
    const button = document.querySelector("#rss-form button");
    if (!button) return;

    switch (status) {
      case "loading":
        button.disabled = true;
        button.textContent = i18Instance.t("ui.loadingButton");
        break;
      case "succeeded":
      case "failed":
        button.disabled = false;
        button.textContent = i18Instance.t("ui.submitButton");
        break;
      default:
        button.disabled = false;
        button.textContent = i18Instance.t("ui.submitButton");
    }
  }

  return watchedState;
}
