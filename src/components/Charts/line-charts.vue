<template>
  <div ref="myCharts" class="chartBox_d"></div>
</template>
<script>
import echarts from "echarts";
import resize from "@/mixins/resize";
require("echarts/theme/macarons");
export default {
  // mixins 选项接收一个混入对象的数组。
  // 这些混入对象可以像正常的实例对象一样包含实例选项，
  // 这些选项将会被合并到最终的选项中，
  // 使用的是和 Vue.extend() 一样的选项合并逻辑。
  // 也就是说，如果你的混入包含一个 created 钩子，
  // 而创建组件本身也有一个，那么两个函数都会被调用。
  // mixins 钩子按照传入顺序依次调用，
  // 并在调用组件自身的钩子之前被调用。
  mixins: [resize],
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mycharts: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this._setOption(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.mycharts) {
      return;
    }
    this.mycharts.dispose();
    this.mycharts = null;
  },
  methods: {
    initChart() {
      this.mycharts = echarts.init(this.$refs.myCharts, "macarons");
      try {
        this._setOption();
      } catch (err) {
        console.log(err);
      }
    },
    _setOption(chartData) {
      this.mycharts.setOption(
        {
          title: {
            text: chartData.title || "",
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
              axisLabel: {
                interval: 0,
                rotate: 40,
              },
              type: "category",
              boundaryGap: false,
              data: chartData.xData || [],
            },
          ],
          yAxis: [
            {
              type: "value",
              boundaryGap: [0, "100%"],
            },
          ],
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: chartData.xDataZoom || 100,
            },
            {
              start: 0,
              end: chartData.xDataZoom || 100,
            },
          ],
          series: [
            {
              name: chartData.seriesName || "",
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
              data: chartData.yData || [],
              animationDuration: 2800,
              animationEasing: "quadraticOut",
            },
          ],
        },
        true
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.chartBox_d {
  height: 100%;
  box-sizing: border-box;
  padding: 30px 20px 30px 20px;
}
</style>