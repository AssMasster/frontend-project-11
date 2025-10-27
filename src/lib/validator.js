import * as yup from "yup";

export function validateUrl(url, existingUrls, i18nInstance) {
  const translations = i18nInstance.getResourceBundle(
    i18nInstance.language,
    "translation"
  );
  console.log("Все переводы:", translations);
  const schema = yup.string();

  schema
    .required(i18nInstance.t("ui.errors.required"))
    .url(i18nInstance.t("ui.errors.invalidUrl"))
    .notOneOf(existingUrls, i18nInstance.t("ui.errors.duplicate"));

  return schema.validate(url);
}
