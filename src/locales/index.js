const resources = {
  en: {
    translation: {
      languages: {
        en: "English",
        ru: "Russian",
      },
      ui: {
        title: "RSS Aggregator",
        urlLabel: "RSS URL",
        urlPlaceholder: "https://example.com/rss",
        submitButton: "Add RSS",
        checkingButton: "Checking...",
        errors: {
          required: "Required field",
          invalidUrl: "Invalid URL",
          duplicate: "URL already exists",
          network: "Network error",
        },
      },
    },
  },
  ru: {
    translation: {
      languages: {
        en: "Английский",
        ru: "Русский",
      },
      ui: {
        title: "RSS Агрегатор",
        urlLabel: "RSS ссылка",
        urlPlaceholder: "https://example.com/rss",
        submitButton: "Добавить RSS",
        checkingButton: "Проверяем...",
        errors: {
          required: "Обязательное поле",
          invalidUrl: "Некорректный URL",
          duplicate: "URL уже существует",
          network: "Ошибка сети",
        },
      },
    },
  },
};

export default resources;
