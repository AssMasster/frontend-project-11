import * as yup from "yup";

export function validateUrl(url, exitingUrls) {
  const schema = yup
    .string()
    .required("Обязательное поле")
    .url("Некорректный URL")
    .notOneOf(exitingUrls, "URL уже существует");

  return schema.validate(url);
}
