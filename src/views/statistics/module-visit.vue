<template>
  <div class="slideCharts">
    <div class="chartBox">
      <line-charts :chartData="chartData"></line-charts>
    </div>
  </div>
</template>

<script>
import { MODULE_NAME } from '@/config/index.js';
import { getModuleVisitCnt } from '@/api/dashboard.js';
import LineCharts from '@/components/Charts/line-charts.vue';
export default {
  components: {
    LineCharts,
  },
  data() {
    return {
      chartData: {
        title: "",
        seriesName: "",
        xData: [],
        yData: [],
      },
    }
  },
  created() {
    this._getModuleVisitCnt();
  },
  methods: {
    /**
     * 初始化校区列表
     */
    initChartData(data) {
      let mp = [],
        moduleList = [],
        cnt = [];
      for (let key in data) {
        let tmp = [];
        tmp[0] = key;
        tmp[1] = data[key];
        mp.push(tmp);
      }
      mp.sort((a, b) => b[1] - a[1]);

      for (let kv of mp) {
        moduleList.push(MODULE_NAME[kv[0]]);
        cnt.push(kv[1]);
      }
      this.chartData = {
        xData: Object.assign([], moduleList),
        yData: Object.assign([], cnt),
        title: '模块访问情况统计',
        seriesName: '访问量'
      };
    },

    /**
     * 获取全部数据
     */
    _getModuleVisitCnt(startT, endT) {
      getModuleVisitCnt(startT, endT)
        .then((res) => {
          this.initChartData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  }
}
</script>
<style lang="scss" scoped>
.slideCharts {
  height: calc(100% - 72px);
}
.chartBox {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  height: 100%;
  .chartBox_d {
    height: 100%;
    box-sizing: border-box;
    padding: 30px 20px 30px 20px;
  }
}
</style>
