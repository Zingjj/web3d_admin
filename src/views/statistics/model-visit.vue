<template>
  <div class="slideCharts">
    
    <div class="chartBox">
      <div class="campusSelect">
        <el-select v-model="campusId" @change="handleChange" placeholder="请选择">
          <el-option
            v-for="item in campusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </div>
      <line-charts :chartData="chartData"></line-charts>
    </div>
  </div>
</template>

<script>
import { getCampusList } from "@/api/campusData.js";
import { getBuildingModelVisitCnt } from "@/api/dashboard.js";
import LineCharts from "@/components/Charts/line-charts.vue";
export default {
  components: {
    LineCharts,
  },
  data() {
    return {
      campusId: 1, // 默认中心校区
      campusList: [],
      chartData: {
        title: "",
        seriesName: "",
        xData: [],
        yData: [],
        xDataZoom: 0
      },
    };
  },
  async created() {
    // 获取校区列表
    await this._getCampusList();
    this._getBuildingModelVisitCnt(this.campusId);
  },
  methods: {
    _getBuildingModelVisitCnt(campusId, startT, endT) {
      getBuildingModelVisitCnt(campusId, startT, endT)
        .then((res) => {
          this.initChartData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    _getCampusList() {
      return getCampusList().then(res => {
        this.campusList = [];
        for (let campus of res.data) {
          this.campusList.push({
            value: campus.campusId,
            label: campus.campusName,
            disabled: campus.campusId == 9
          })
        }
      })
    },
    /**
     * 初始化图表数据
     */
    initChartData(data) {
      let modelList = [],
        cnt = [];
      for (let obj of data) {
        modelList.push(obj.buildName);
        cnt.push(obj.cnt);
      }
      this.chartData = {
        xData: Object.assign([], modelList),
        yData: Object.assign([], cnt),
        title: "校区建筑模型浏览情况统计",
        seriesName: "访问量",
        xDataZoom: 50
      };
    },

    handleChange(val) {
      this._getBuildingModelVisitCnt(val);
    }
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
  .campusSelect {
    position: absolute;
    right: 40px;
    top: 95px;
    height: 60px;
    width: 250px;
    z-index: 100;
  }
}
</style>
