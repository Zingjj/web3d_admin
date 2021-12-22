<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>校区数据管理</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="校区名称，校区简称关键字"
          class="width1"
          v-model="sch_order"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchCampus"
          >搜索</el-button
        >
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column
          prop="campusId"
          label="id"
          width="50"
        ></el-table-column>
        <el-table-column width="100" prop="campusName" label="校区名称"></el-table-column>
        <el-table-column width="100" prop="campusShortName" label="简称">
          <template slot-scope="scope">
            {{ scope.row.campusShortName | campusShortNameText }}
          </template>
        </el-table-column>
        <el-table-column
          prop="city"
          label="所在城市"
          width="100"
        ></el-table-column>
        <el-table-column width="150" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="describe" label="详细描述" show-overflow-tooltip width="90">
        </el-table-column>
        <el-table-column prop="shortDes" label="简略描述" show-overflow-tooltip width="90">
        </el-table-column>
        <el-table-column
          prop="data"
          label="校区数据"
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
        <el-table-column label="操作" width="85">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >修改</el-button
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
    <el-dialog title="订单修改" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="订单号">
          <el-input
            type="text"
            v-model="formData.order"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单时间" prop="time">
          <el-date-picker
            v-model="formData.time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="配送地址" prop="address">
          <el-input
            type="text"
            placeholder="请输入地址"
            v-model="formData.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            type="text"
            placeholder="请输入电话"
            v-model="formData.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="配送员" prop="name">
          <el-input
            type="text"
            placeholder="请输入姓名"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholde="请选择状态">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
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
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      sch_order: "",
      sch_status: null,
      sch_date: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: "",
      options: [
        { label: "正常", value: 0 },
        { label: "禁用", value: 1 }
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
      } else if (val === 1) {
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
    handleSize(val) {
      this.pageSize = val;
      this.getPageData();
    },
    handlePage(val) {
      this.currentPage = val;
      this.getPageData();
    },
    _getCampusList() {
      getCampusList()
        .then((res) => {
          this.tableData = res.data;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    getPageData() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize;
      this.tableData = this.schArr.slice(start, end);
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
     */
    searchCampus() {},
    // add
    addTab() {
      this.formData = {};
      this.diaIsShow = true;
      this.formData.order = (Math.random() * 10e18).toString();
      this.formData.id = this.allList.length + 1;
      this.editType = "add";
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
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
      row.status = 3;
      this.$notify({
        title: "成功",
        message: "已取消该订单",
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
    }
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
  .el-button {
    padding: 11px 20px;
  }
}
.width1 {
  width: 260px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 350px;
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
  width: 400px;
}
</style>
