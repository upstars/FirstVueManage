import Mock from "mockjs";
import userApi from "./user";
import permissionApi from "./permission";

//本地获取user数据
Mock.mock(/user\/getUserData/, userApi.getUserList);
//增加User数据
Mock.mock(/user\/addUser/, userApi.createUser);
//更新User数据
Mock.mock(/user\/editUser/, userApi.updateUser);
//删除User数据
Mock.mock(/user\/deleteUser/, userApi.deleteUser);
//根据用户不同获取菜单
Mock.mock(/permission\/getMenu/, permissionApi.getMenu);
