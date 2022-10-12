<template>
  <el-header>
    <!-- 左边内容 -->
    <div class="l-content">
      <el-button @click="change">
        <el-icon>
          <Fold />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">{{
          current.label
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右边内容 -->
    <div class="r-content">
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="imgSrc" alt="" />
        </span>
        <!-- 下拉内容 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">SignOut</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const imgSrc = require("../assets/images/user.jpg");
const store = useStore();
const router = useRouter();
const current = computed(() => {
  return store.state.currentMenu;
});
//侧边栏收缩
const change = () => {
  store.commit("updateIsCollapse");
};
//退出登录并清空本地存储
const handleLoginOut = () => {
  store.commit("clearMenu");
  store.commit("clearToken");
  router.push("login");
};
</script>

<style lang="less">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.el-header {
  height: 45px;
}

.r-content {
  img {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
  }
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
    outline: none;
    border: none;

    .el-icon {
      font-size: 25px;
    }
  }

  .bread :deep(span) {
    cursor: pointer;
  }
}
</style>
