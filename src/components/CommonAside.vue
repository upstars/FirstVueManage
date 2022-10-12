<template>
  <el-aside :width="$store.state.isCollapse ? '180px' : '64px'">
    <!-- 菜单 -->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#304156"
      text-color="#fff"
      :collapse="!$store.state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="$store.state.isCollapse">VUE BMS</h3>
      <h3 v-show="!$store.state.isCollapse">VUE</h3>
      <!-- 单级菜单 -->
      <el-menu-item
        v-for="item in noChildren()"
        :index="item.path"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <!-- 多级菜单 -->
      <el-sub-menu
        :index="item.label"
        v-for="item in hasChildren()"
        :key="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item-group>
          <el-menu-item
            v-for="(subItem, subIndex) in item.children"
            :index="subItem.path"
            :key="subIndex"
            @click="clickMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon"></component>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
const asyncList = store.state.menu;
const list = [
  {
    path: "/user",
    name: "user",
    label: "用户管理",
    icon: "user",
    url: "UserManage/UserManage",
  },
  {
    label: "其他",
    icon: "location",
    path: "/other",
    children: [
      {
        path: "/page1",
        name: "page1",
        label: "页面1",
        icon: "setting",
        url: "Other/PageOne",
      },
      {
        path: "/page2",
        name: "page2",
        label: "页面2",
        icon: "setting",
        url: "Other/PageTwo",
      },
    ],
  },
];

//判断是否有二级菜单
const noChildren = () => {
  return asyncList.filter((item) => !item.children);
};

const hasChildren = () => {
  return asyncList.filter((item) => item.children);
};

const clickMenu = (item) => {
  router.push({
    name: item.name,
  });
  store.commit("selectMenu", item);
};
</script>

<style lang="less" scoped>
.icons {
  width: 18px;
  height: 18px;
}

.el-menu {
  border-right: none;
  text-align: center;

  h3 {
    line-height: 48px;
    color: rgb(183, 203, 225);
    font-size: large;
    font-weight: 400;
  }
}
</style>
