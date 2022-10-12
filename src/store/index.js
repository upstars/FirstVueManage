import { createStore } from "vuex";
import Cookie from "js-cookie";

export default createStore({
  state: {
    isCollapse: true,
    currentMenu: null,
    tagsList: [
      {
        path: "/",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    menu: [],
    token: "",
    bgc: "",
  },
  getters: {},
  mutations: {
    //侧边栏缩放
    updateIsCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    //点击侧边栏，显示tags
    selectMenu(state, val) {
      if (val.name == "home") {
        state.currentMenu = null;
      } else {
        state.currentMenu = val;
        let result = state.tagsList.findIndex((item) => item.name === val.name);
        result == -1 ? state.tagsList.push(val) : "";
      }
    },
    //关闭tags
    closeTag(state, val) {
      let res = state.tagsList.findIndex((item) => item.name === val.name);
      state.tagsList.splice(res, 1);
    },
    //数据持久化，刷新页面后数据会丢失，使用本地存储
    setMenu(state, val) {
      state.menu = val;
      localStorage.setItem("menu", JSON.stringify(val));
    },
    //动态路由
    addMenu(state, router) {
      if (!localStorage.getItem("menu")) {
        return;
      }
      const menu = JSON.parse(localStorage.getItem("menu"));
      state.menu = menu;
      //动态路由
      const menuArray = [];
      menu.forEach((item) => {
        if (item.children) {
          item.children = item.children.map((item) => {
            //注意,引入组件需要使用下面的方式,不然会报错
            item.component = () => {
              return import(`../views/${item.url}.vue`);
            };
            return item;
          });
          menuArray.push(...item.children);
        } else {
          item.component = () => {
            return import(`../views/${item.url}.vue`);
          };
          menuArray.push(item);
        }
      });

      menuArray.forEach((item) => {
        router.addRoute("home1", item);
      });
    },
    //清空本地存储,退出登录
    clearMenu(state) {
      state.menu = [];
      localStorage.removeItem("menu");
    },
    //设置token
    setToken(state, val) {
      state.token = val;
      Cookie.set("token", val);
    },
    //清除token
    clearToken(state) {
      state.token = "";
      Cookie.remove("token");
    },
    //获取token
    getToken(state) {
      state.token = state.token || Cookie.get("token");
    },
  },
  actions: {},
  modules: {},
});
