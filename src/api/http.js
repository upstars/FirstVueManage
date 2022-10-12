import axios from "axios";

const Service = axios.create({
  headers: {
    "Content-type": "application/json;charset=utf-8",
  },
  timeout: 8000,
});

//请求拦截器
Service.interceptors.request.use((request) => {
  return request;
});

//响应拦截器
Service.interceptors.response.use((response) => {
  return response;
});

function request(options) {
  if (options.mock) {
    //线上mock
    Service.defaults.baseURL =
      "https://www.fastmock.site/mock/88e98414787adf14a5263cdf068fb152/vue-back";
  } else {
    //本地mock
    Service.defaults.baseURL = "";
  }
  //注意传过来的数据中没有params,只有data属性
  options.params = options.data;
  return Service(options);
}

export default request;
