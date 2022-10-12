<template>
  <!-- 主体 -->
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 侧边栏 -->
      <common-aside />
      <!-- 右边内容 -->
      <el-container>
        <!-- header -->
        <common-header />
        <!-- tag -->
        <common-tab />
        <!-- main -->
        <el-main class="right-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "../components/CommonAside.vue";
import CommonHeader from "../components/CommonHeader.vue";
import CommonTab from "../components/CommonTab.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    CommonAside,
    CommonHeader,
    CommonTab,
  },
});
</script>

<style lang="less">
.el-container {
  flex-wrap: wrap;
  align-items: flex-start;
  height: 100%;
}

.common-layout {
  .lay-container {
    flex-wrap: nowrap;

    .right-main {
      height: calc(100% - 92px);
      &::-webkit-scrollbar {
        width: 7px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #304156;
      }
    }
  }

  height: 100%;

  & > .el-container {
    height: 100%;

    & > .el-aside {
      height: 100%;
      background: #304156;
      overflow: hidden;
    }
  }
}
</style>