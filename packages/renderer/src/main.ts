import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import "element-plus/dist/index.css";
import "./styles/index.scss";

const app = createApp(App);

app.use(router);
app.use(store, key);
app.mount("#app").$nextTick(window.removeLoading);
