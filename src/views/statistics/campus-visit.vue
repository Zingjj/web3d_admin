<template>
  <div class="slideCharts">
    <div class="chartBox">
      <div class="btns">
        <el-button
          :class="{ active: shows === 1 }"
          size="small"
          @click="
            setChartData('today');
            shows = 1;
          "
          >当日</el-button
        >
        <el-button
          :class="{ active: shows === 2 }"
          size="small"
          @click="
            setChartData('lastWeek');
            shows = 2;
          "
          >最近一周</el-button
        >
        <el-button
          :class="{ active: shows === 3 }"
          size="small"
          @click="
            setChartData('lastMonth');
            shows = 3;
          "
          >最近一月</el-button
        >
        <el-button
          :class="{ active: shows === 4 }"
          size="small"
          @click="
            setChartData('all');
            shows = 4;
          "
          >全部</el-button
        >
      </div>
      <div ref="myCharts" class="chartBox_d"></div>
    </div>
  </div>
</template>

<script>
import { getCampusVisitCnt } from "@/api/campusData.js";
import { CAMPUS_NAME_CH } from "@/config/index.js";
import echarts from "echarts";
import resize from "@/mixins/resize";
require("echarts/theme/macarons");
export default {
  mixins: [resize],
  data() {
    return {
      mycharts: null,
      shows: 4,
      campus: [],
      price: [],
      chartData: {
        campus: [],
        visitCnt: [],
      },
    };
  },
  mounted() {
    this._getCampusVisitCnt();
    // this.$nextTick().then(() => {
    //   this.initEcharts();
    // });
  },
  methods: {
    /**
     * 初始化校区列表
     */
    initChartData(data) {
      let mp = [],
        campusList = [],
        cnt = [];
      for (let key in data) {
        let tmp = [];
        tmp[0] = key;
        tmp[1] = data[key];
        mp.push(tmp);
      }
      mp.sort((a, b) => b[1] - a[1]);

      for (let kv of mp) {
        campusList.push(CAMPUS_NAME_CH[kv[0]]);
        cnt.push(kv[1]);
      }
      this.chartData.campus = Object.assign([], campusList);
      this.chartData.visitCnt = Object.assign([], cnt);
    },
    _getCampusVisitCnt() {
      getCampusVisitCnt()
        .then((res) => {
          this.initChartData(res.data);
          this.initEcharts();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setChartData(type) {
      this._setOption(this.chartData);
    },
    initEcharts() {
      this.mycharts = echarts.init(this.$refs.myCharts, "macarons");
      this.setChartData("all");
    },
    _setOption(chartData) {
      console.log(chartData);
      this.mycharts.setOption({
        title: {
          text: "校区点击情况柱状图",
          left: "16",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              background: "#6a7985",
            },
          },
        },
        grid: {
          left: "20",
          right: "20",
          bottom: "3",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: chartData.campus,
          },
        ],
        yAxis: [
          {
            type: "value",
            boundaryGap: [0, "100%"],
          },
        ],
        series: [
          {
            name: "访问量",
            type: "line",
            areaStyle: {
              color: "#55a8fd",
              opacity: 0.3,
            },
            itemStyle: {
              color: "#55a8fd",
            },
            lineStyle: {
              color: "#55a8fd",
            },
            smooth: false,
            data: chartData.visitCnt,
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
        ],
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.slideCharts {
  height: calc(100% - 72px);
}
.chartBox {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  height: 100%;
  position: relative;
  .chartBox_d {
    height: 100%;
    box-sizing: border-box;
    padding: 30px 20px 30px 20px;
  }
  .btns {
    position: absolute;
    right: 40px;
    top: 20px;
    z-index: 99;
    .el-button.active {
      color: #3a8ee6;
      background: #ddeeff;
    }
  }
}
</style>
