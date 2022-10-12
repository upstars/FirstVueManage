import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/less/index.less";
import "./mock/index.js";


const app = createApp(App);
store.commit("addMenu", router);
//路由守卫
const checkRouter = (path) => {
  let hasCheck = router
    .getRoutes()
    .filter((route) => route.path == path).length;
  if (hasCheck) return true;
  else return false;
};
router.beforeEach((to, from, next) => {
  store.commit("getToken");
  const token = store.state.token;
  if (!token && to.name != "login") {
    next({ name: "login" });
  } else if (!checkRouter(to.path)) {
    next({ name: "home" });
  } else {
    next();
  }
});

app.use(store).use(router).mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
