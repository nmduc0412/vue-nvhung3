import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "devextreme/dist/css/dx.light.css";
import i18n from "@/plugins/i18n";
import store from "@/store/index";
import Toaster from "@meforma/vue-toaster";
import { formatCurrency, formatNumber } from "@/base/functions/commonFns";
import { VueReCaptcha } from "vue-recaptcha-v3";

const app = createApp(App);

app.use(router);

app.use(store);

app.use(i18n);

app.use(Toaster);

app.use(VueReCaptcha, { siteKey: import.meta.env.VITE_SITE_KEY });

// var configJSON = new Promise((resolve, reject) => {
//   fetch(import.meta.env.BASE_URL + "config/config.prod.json")
//     .then((response) => response.json())
//     .then((config) => {
//       // either use window.config
//       window.config = config;
//       // or use [Vue Global Config][1]
//       app.config.globalProperties.$config = config;
//       // FINALLY, mount the app
//       app.mount("#app");
//       resolve(true);
//     });
// });

// await configJSON;

app.mount("#app");

app.config.globalProperties.$filters = {
  currency(value: any, currency = "đ", decimals = 2) {
    return formatCurrency(value, currency, decimals);
  },
  number(value: any, decimals = 2) {
    return formatNumber(value, decimals);
  },
};
