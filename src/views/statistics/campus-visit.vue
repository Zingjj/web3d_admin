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
      <!-- class="chartBox_d" -->
      <!-- 此处放可视化图表 -->
      <line-charts :chartData="chartData"></line-charts>
    </div>
  </div>
</template>

<script>
import { getCampusVisitCnt } from "@/api/dashboard.js";
import { CAMPUS_NAME_CH } from "@/config/index.js";
import LineCharts from "@/components/Charts/line-charts.vue";
export default {
  components: {
    LineCharts,
  },
  data() {
    return {
      shows: 4,
      chartData: {
        title: "",
        seriesName: "",
        xData: [],
        yData: [],
      },
    };
  },
  created() {
    this._getCampusVisitCnt();
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
      this.chartData = {
        xData: Object.assign([], campusList),
        yData: Object.assign([], cnt),
        title: "校区访问情况统计",
        seriesName: "访问量",
      };
    },
    _getCampusVisitCnt() {
      getCampusVisitCnt()
        .then((res) => {
          this.initChartData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setChartData(type) {
      // this._setOption(this.chartData);
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
