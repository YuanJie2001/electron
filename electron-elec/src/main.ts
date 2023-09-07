import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.ts";
import ElementPlus from "element-plus";
import { createPinia } from 'pinia'
import "element-plus/dist/index.css";
import axios from "axios";
import VueAxios from "vue-axios";

const app = createApp(App);
const pinia = createPinia()
app.use(router);
app.use(pinia);
app.use(ElementPlus).use(VueAxios, axios);
app.mount("#app");
