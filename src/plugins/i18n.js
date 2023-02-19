import { createI18n } from "vue-i18n";
import viLocale from "@/locales/vi";
import enLocale from "@/locales/en";
import { getLocalStorage } from "@/base/functions/localStorageFns";

function loadLocaleMessages() {
  const messages = {
    en: {
      ...enLocale,
    },
    vi: {
      ...viLocale,
    },
  };
  return messages;
}

function getLocale() {
  const locale = getLocalStorage("lang");
  return locale || "vi";
}

const i18n = createI18n({
  locale: getLocale(),
  fallbackLocale: getLocale(),
  messages: loadLocaleMessages(),
  allowComposition: true,
});

export default i18n;
