/*
整个项目api的管理
*/
import request from "./http";

//获取HomeTable数据
const getHomeData = () => {
  return request({
    url: "/home/getHomeData",
    method: "get",
    mock: true,
  });
};
//获取count数据
const getCountData = () => {
  return request({
    url: "/home/getCountData",
    method: "get",
    mock: true,
  });
};
//获取user数据
const getUserData = (params) => {
  return request({
    url: "/user/getUserData",
    method: "get",
    data: params,
    mock: false,
  });
};
//增加user
const addUser = (params) => {
  return request({
    url: "/user/addUser",
    method: "post",
    data: params,
    mock: false,
  });
};
//更新user数据
const editUser = (params) => {
  return request({
    url: "/user/editUser",
    method: "post",
    data: params,
    mock: false,
  });
};
//删除user数据
const deleteUser = (params) => {
  return request({
    url: "/user/deleteUser",
    method: "get",
    data: params,
    mock: false,
  });
};
//根据用户名不同返回不一样的菜单列表
const getMenu = (params) => {
  return request({
    url: "/permission/getMenu",
    method: "post",
    data: params,
    mock: false,
  });
};
//获取echarts数据
const getChartData = () => {
  return request({
    url: "/home/getChartData",
    method: "get",
    mock: true,
  });
};
export {
  getHomeData,
  getCountData,
  getUserData,
  addUser,
  editUser,
  deleteUser,
  getMenu,
  getChartData,
};
