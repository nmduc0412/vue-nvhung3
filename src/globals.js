import { createApp } from "vue";
import Toast, { PluginOptions } from "vue-toastification";
const app = createApp({})
app.config.globalProperties.$http = () => {};
app.use(Toast, options);