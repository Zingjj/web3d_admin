<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>学院数据管理</span>
      </div>
      <div class="searchDiv">
        <span class="vertical-center">校区：</span>
        <el-select
          style="margin-right: 10px"
          v-model="campusId"
          placeholder="请选择校区"
        >
          <el-option
            v-for="item in campusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
        <span class="vertical-center">学院分类：</span>
        <el-select
          style="margin-right: 10px"
          clearable
          v-model="collegeTypeId"
          placeholder="请选择"
          @change="searchCollege"
          @clear="searchCollege"
        >
          <el-option
            v-for="item in collegeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
        <el-input
          type="text"
          placeholder="学院名称、简称关键字"
          clearable
          class="width1"
          v-model="searchKey"
          @clear="searchCollege"
        ></el-input>
        <div class="vertical-center">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="searchCollege"
            >搜索</el-button
          >
          <el-button
            type="success"
            size="medium"
            icon="el-icon-plus"
            @click="handleAdd"
            >新增</el-button
          >
        </div>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column
          prop="collegeId"
          label="id"
          width="50"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="collegeName"
          label="学院名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="100" prop="collegeTypeName" label="类别">
        </el-table-column>
        <el-table-column
          prop="buildName"
          label="所属建筑"
          width="100"
        ></el-table-column>
        <el-table-column
          width="110"
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="describe"
          label="学院描述"
          show-overflow-tooltip
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="shortDes"
          label="学院简介"
          show-overflow-tooltip
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="picUrl"
          label="学院图片"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <!--  -->
            <el-image
              style="height: 50px"
              :src="scope.row.picUrl"
              :preview-src-list="[scope.row.picUrl]"
              fit="contain"
              lazy
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="cameraView"
          label="视角数据"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="state" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state | tagClass">{{
              scope.row.state | stateText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="toDelete(scope.row)"
              :disabled="scope.row.state == 0 ? false : true"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="修改学院信息"
      width="480px"
      :visible.sync="diaIsShow"
      class="diaForm"
    >
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="校区名称：">
          <el-select disabled v-model="formData.campusId">
            <el-option
              v-for="item in campusList"
              :key="item.value"
              :label="'[' + item.value + ']' + item.label"
              :value="item.value"
              disabled
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院名称：">
          <el-input v-model="formData.collegeName" disabled></el-input>
        </el-form-item>

        <el-form-item label="学院类型：" prop="collegeTypeId">
          <el-select clearable v-model="formData.collegeTypeId">
            <el-option
              v-for="item in collegeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属建筑：" prop="buildId">
          <el-select v-model="formData.buildId">
            <el-option
              v-for="item in buildingList"
              :key="item.buildId"
              :label="'[' + item.buildId + ']' + item.buildName"
              :value="item.buildId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院描述：">
          <el-input
            v-model="formData.describe"
            placeholder="学院描述"
            style="width: 300px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="学院简介：">
          <el-input
            v-model="formData.shortDes"
            placeholder="学院简介"
            style="width: 300px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="学院链接：">
          <el-input
            v-model="formData.webUrl"
            placeholder="学院链接"
            style="width: 300px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="图片："> </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCampusList } from "@/api/campusData";
import { getCollegeList, getCollegeTypeList } from "@/api/collegeData";
import { getBuildingList } from "@/api/buildingData";
import { API_URL } from "@/config/index.js";
import { ElImageViewer } from "element-ui/packages/image/src/image-viewer.vue";

export default {
  components: {
    ElImageViewer,
  },
  data() {
    return {
      campusId: 6,
      tableData: [],

      searchKey: "",
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],

      diaIsShow: false,
      formData: {},
      editType: "",
      options: [
        { label: "待审核", value: 1 },
        { label: "配送中", value: 2 },
        { label: "已完成", value: 0 },
        { label: "已取消", value: 3 },
      ],
      rowIndex: 0,
      rules: {
        // order: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        time: [
          {
            // type: 'datetime',
            required: true,
            message: "请输入时间",
            trigger: "change",
          },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        status: [
          { required: true, message: "请选择订单状态", trigger: "change" },
        ],
      },
      campusList: [],
      collegeTypeList: [],
      collegeTypeId: "",

      buildingList: [],
    };
  },
  created() {
    this._getCampusList();
  },
  filters: {
    campusShortNameText(val) {
      if (!val) return "-";
    },
    stateText(val) {
      if (val === undefined) return;
      if (val === 0) {
        return "正常";
      } else if (val === 0) {
        return "禁用";
      }
    },
    tagClass(val) {
      if (val === undefined) return;
      if (val === 0) {
        return "success";
      } else if (val === 1) {
        return "info";
      }
    },
  },
  methods: {
    initTable() {
      this.currentPage = 1;
      this.tableData = [];
    },
    handleSize(val) {
      this.pageSize = val;
      this._getCollegeList(this.campusId, this.currentPage, this.pageSize);
    },
    handlePage(val) {
      this.currentPage = val;
      this._getCollegeList(this.campusId, this.currentPage, this.pageSize);
    },
    _getCampusList() {
      getCampusList().then((res) => {
        this.campusList = [];
        for (let campus of res.data) {
          this.campusList.push({
            value: campus.campusId,
            label: campus.campusName,
            disabled: campus.campusId == 9,
          });
        }
        this.campusId = 6; // 默认软件园校区
        this._getCollegeList();
        this._getCollegeTypeList();
        this._getBuildingList();
      });
    },
    _getCollegeTypeList() {
      this.collegeTypeList = [];
      getCollegeTypeList(this.campusId)
        .then((res) => {
          for (let item of res.data) {
            this.collegeTypeList.push({
              value: item.collegeTypeId,
              label: item.collegeTypeName,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    _getCollegeList() {
      this.initTable();
      getCollegeList(this.campusId, this.currentPage, this.pageSize)
        .then((res) => {
          // this.tableData = res.data;
          for (let item of res.data) {
            let tmp = Object.assign({}, item);
            tmp.picUrl = API_URL + tmp.picUrl;
            this.tableData.push(tmp);
          }
          this.total = res.respPage.totalCount;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    /**
     * 查找该校区的建筑列表
     */
    _getBuildingList() {
      getBuildingList(this.campusId)
        .then((res) => {
          this.buildingList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查找
    // searchTab() {
    //   let arrList = []
    //   for (let item of this.allList) {
    //     if (
    //       this.sch_order.trim() === '' &&
    //       this.sch_status === null &&
    //       this.sch_date === null
    //     ) {
    //       arrList = this.allList
    //       break
    //     } else if (
    //       item.order.startsWith(this.sch_order) &&
    //       (this.sch_status !== null ? item.status === this.sch_status : true) &&
    //       (this.sch_date !== null ? item.time.startsWith(this.sch_date) : true)
    //     ) {
    //       let obj = Object.assign({}, item)
    //       arrList.push(obj)
    //     }
    //   }
    //   this.schArr = arrList
    //   this.total = arrList.length
    //   this.currentPage = 1
    //   this.pageSize = 10
    //   this.getPageData()
    // },
    /**
     * 查找
     * by Type or by key
     */
    searchCollege() {
      this.initTable();
      getCollegeList(
        this.campusId,
        this.currentPage,
        this.pageSize,
        this.collegeTypeId,
        this.searchKey
      ).then((res) => {
        for (let item of res.data) {
          let tmp = Object.assign({}, item);
          tmp.picUrl = API_URL + tmp.picUrl;
          this.tableData.push(tmp);
        }
        this.total = res.respPage.totalCount;
      });
    },
    // add
    // addTab() {
    //   this.formData = {};
    //   this.diaIsShow = true;
    //   this.formData.order = (Math.random() * 10e18).toString();
    //   this.formData.id = this.allList.length + 1;
    //   this.editType = "add";
    //   this.$nextTick(() => {
    //     this.$refs.diaForm.clearValidate();
    //   });
    // },
    /**
     * 新增学院
     */
    handleAdd() {},
    // 审核
    toConfirm(row) {
      row.status = 2;
      this.$notify({
        title: "成功",
        message: "审核提交成功",
        type: "success",
      });
    },
    // 完成
    toSuccess(row) {
      row.status = 0;
      this.$notify({
        title: "成功",
        message: "该订单已完成配送",
        type: "success",
      });
    },
    // 取消
    toDelete(row) {
      
      this.$notify({
        title: "成功",
        message: "已删除相关信息",
        type: "success",
      });
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row);
      this.editType = "update";
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
      this.rowIndex = index;
    },
    changeTab(form, type) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (type === "update") {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize;
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            );
            // 解决数组不能通过索引响应数据变化
            this.$set(
              this.tableData,
              this.rowIndex,
              Object.assign({}, this.formData)
            );
            this.$notify({
              title: "成功",
              message: "订单已修改成功",
              type: "success",
            });
          } else {
            this.tableData.unshift(Object.assign({}, this.formData));
            this.allList.push(Object.assign({}, this.formData));
          }
          this.diaIsShow = false;
        } else {
          return;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.anoCard .el-table .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
}
.vertical-center {
  display: flex;
  align-items: center;
}
.width1 {
  width: 260px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 300px;
    margin-bottom: 5px;
  }
}
</style>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: "";
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.diaForm .el-form-item__label {
  padding-right: 20px;
}
.searchDiv [class^="el-icon"] {
  color: #fff;
}
.el-tooltip__popper {
  max-width: 300px;
}
</style>
