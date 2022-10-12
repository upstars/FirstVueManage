<template>
  <el-form :model="loginForm" class="login-container">
    <p>系统登录</p>
    <el-form-item label="账户">
      <el-input
          v-model="loginForm.username"
          placeholder="请输入账号"
          prefix-icon="User"
          type="input"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          show-password
          type="password"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {useRouter} from "vue-router";
import {reactive} from "vue";
import {useStore} from "vuex";
import {getMenu} from "@/api/api";

const router = useRouter();
const store = useStore();
const loginForm = reactive({
  username: "admin",
  password: "admin",
});
//登录
const login = async () => {
  const res = await getMenu(loginForm);
  store.commit("setMenu", res.data.data.menu);
  console.log(res);
  store.commit("addMenu", router);
  store.commit("setToken", res.data.data.token);
  router.push({name: "home"});
};
</script>

<style lang="less" scoped>
.login-container {
  position: absolute;
  text-align: center;
  width: 350px;
  background-color: #fff;
  border: none;
  border-radius: 10px;
  margin: auto;
  padding: 15px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 300px;
  box-shadow: 0 0 5px #7e7b7b;
  outline: none;

  &:hover {
    box-shadow: 0 0 10px #7e7b7b;
  }

  p {
    margin-top: 20px;
    margin-bottom: 30px;
    font-size: 30px;
    color: #1e1e1e;
  }

  :deep(.el-form-item__content) {
    justify-content: center;

    .el-button {
      margin-top: 30px;
    }
  }
}
</style>