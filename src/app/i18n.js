import i18n from "i18next";
import resurses from "../locales/index.js";

export function initI18n() {
  return new Promise((resolve, reject) => {
    const i18Instance = i18n.createInstance();

    i18Instance
      .init({
        lng: "en",
        debag: false,
        resurses,
      })
      .then(() => {
        console.log("seccess");
        resolve(i18Instance);
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
}
