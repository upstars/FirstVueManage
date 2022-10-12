<template>
  <el-row class="home" :gutter="10">
    <!-- 左边栏 -->
    <el-col :span="10">
      <!-- 登录信息卡片 -->
      <el-card shadow="hover">
        <div class="user">
          <img src="../../assets/images/user.jpg" />
          <div class="user-info">
            <p class="name">Admin</p>
            <p class="role">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:<span>2022/7/1</span></p>
          <p>上次登录地点:<span>北京</span></p>
        </div>
      </el-card>
      <!-- 具体信息卡片 -->
      <el-card shadow="hover" style="margin-top: 5px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :label="val"
            :prop="key"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 右边栏 -->
    <el-col :span="14">
      <!-- 订单信息 -->
      <div class="num">
        <el-card
          :body-style="{ display: 'flex', padding: 0 }"
          v-for="item in countData"
          :key="item.name"
          shadow="hover"
        >
          <component
            class="icons"
            :is="item.icon"
            :style="{ background: item.color }"
          ></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线图 -->
      <el-card style="height: 280px; width: 100%" shadow="hover">
        <div ref="echart" style="height: 280px"></div>
      </el-card>
      <!-- 柱状图 ,饼状图-->
      <div class="graph">
        <el-card style="height: 240px">
          <div ref="userechart" style="height: 240px"></div>
        </el-card>
        <el-card style="height: 240px">
          <div ref="videoechart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
} from "vue";
import { getHomeData, getCountData, getChartData } from "@/api/api";
import * as echarts from "echarts";

export default defineComponent({
  setup() {
    let tableData = ref([]);
    let countData = ref([]);
    //通过proxy获取ref,和proxy.$api.method()
    const { proxy } = getCurrentInstance();
    const tableLabel = {
      name: "名称",
      todayBuy: "今日购买",
      monthBuy: "本月购买",
      totalBuy: "总共购买",
    };
    //table数据
    const getTableList = async () => {
      await getHomeData().then((res) => {
        tableData.value = res.data.data.tableData;
      });
    };
    //count数据
    const getCountList = async () => {
      await getCountData().then((res) => {
        countData.value = res.data.data;
      });
    };
    //关于echarts表格的渲染
    let xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
    });
    //饼状图
    let pieOptions = reactive({
      tooltip: {
        trigger: "item",
      },
      color: [
        "#0f78f4",
        "#dd536b",
        "#9462e5",
        "#a6a6a6",
        "#e1bb22",
        "#39c362",
        "#3ed1cf",
      ],
      series: [],
    });
    //折线图
    let orderData = reactive({
      xData: [],
      series: [],
    });
    //柱状图
    let userData = reactive({
      xData: [],
      series: [],
    });
    //饼状图
    let videoData = reactive({
      series: [],
    });
    //获取chart数据
    const getEchartData = async () => {
      let result = await getChartData();
      console.log(result);
      let res = result.data.orderData;
      let userRes = result.data.userData;
      let videoRes = result.data.videoData;
      //1.折线图
      orderData.xData = res.date;
      const keyArray = Object.keys(res.data[0]);
      const series = [];
      //将每类手机的销售情况存储到数组，数组中存储的是对象，对象中的data数组存储着每年销售额
      keyArray.forEach((key) => {
        series.push({
          name: key,
          data: res.data.map((item) => item[key]),
          type: "line",
        });
      });
      orderData.series = series;
      //echarts拿到数据
      xOptions.xAxis.data = orderData.xData;
      xOptions.series = orderData.series;
      //进行渲染
      let hEcharts = echarts.init(proxy.$refs["echart"]);
      hEcharts.setOption(xOptions);

      //2.柱状图
      userData.xData = userRes.map((item) => item.date);
      userData.series = [
        {
          name: "新增用户",
          data: userRes.map((item) => item.new),
          type: "bar",
        },
        {
          name: "活跃用户",
          data: userRes.map((item) => item.active),
          type: "bar",
        },
      ];
      xOptions.xAxis.data = userData.xData;
      xOptions.series = userData.series;
      //进行渲染
      let uEcharts = echarts.init(proxy.$refs["userechart"]);
      uEcharts.setOption(xOptions);

      //3.饼状图
      videoData.series = [
        {
          data: videoRes,
          type: "pie",
        },
      ];
      pieOptions.series = videoData.series;
      //进行渲染
      let vEcharts = echarts.init(proxy.$refs["videoechart"]);
      vEcharts.setOption(pieOptions);
    };

    onMounted(() => {
      getTableList();
      getCountList();
      getEchartData();
    });

    return {
      tableData,
      tableLabel,
      countData,
      xOptions,
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  cursor: pointer;

  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #dcdc;
    margin-bottom: 20px;

    img {
      width: 70px;
      height: 70px;
      border-radius: 5px;
      margin-right: 40px;
    }
  }

  .login-info {
    p {
      line-height: 20px;
      color: #999;
      font-size: 14px;

      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }

  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 32%;
      margin-bottom: 20px;

      .icons {
        width: 60px;
        height: 60px;
        font-size: 35px;
        line-height: 60px;
        text-align: center;
        color: #fff;
      }

      .detail {
        display: flex;
        margin-left: 15px;
        flex-direction: column;
        justify-content: center;

        .num {
          font-size: 25px;
          margin-bottom: 10px;
        }

        .txt {
          font-size: 10px;
          text-align: center;
          color: #999;
        }
      }
    }
  }
  .graph {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .el-card {
      width: 48%;
    }
  }
}
</style>