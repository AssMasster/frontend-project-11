import * as yup from "yup";

export function validateUrl(url, existingUrls, i18nInstance) {
  const schema = yup
    .string()
    .required(i18nInstance.t("ui.errors.required"))
    .url("Ссылка должна быть валидным URL")
    .notOneOf(existingUrls, i18nInstance.t("ui.errors.duplicate"));

  return schema.validate(url);
}
