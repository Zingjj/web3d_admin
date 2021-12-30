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
          v-model="searchKey"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="_getCampusList()"
          >搜索</el-button
        >
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column
          prop="campusId"
          label="id"
          width="50"
        ></el-table-column>
        <el-table-column
          width="100"
          prop="campusName"
          label="校区名称"
        ></el-table-column>
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
        <!-- <el-table-column
          width="150"
          prop="createTime"
          label="创建时间"
        ></el-table-column> -->
        <el-table-column
          prop="describe"
          label="校区描述"
          show-overflow-tooltip
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="shortDes"
          label="校区简介"
          show-overflow-tooltip
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="picUrl"
          label="校区图片"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
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
          prop="webUrl"
          label="校区官网"
          show-overflow-tooltip
          width="180"
        >
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
    <el-dialog
      title="校区数据修改"
      :visible.sync="diaIsShow"
      width="480px"
      class="diaForm"
    >
      <el-form
        ref="diaForm"
        :model="formData"
        label-width="115px"
      >
        <el-form-item label="校区名称:">
          <el-select
            disabled
            v-model="formData.campusId"
            style="width: 300px; margin-bottom: 5px"
          >
            <el-option
              v-for="item in campusListAll"
              :key="item.id"
              :label="'[' + item.id + ']' + item.campusName"
              :value="item.id"
              disabled
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在城市:">
          <el-input
            v-model="formData.city"
            style="width: 300px; margin-bottom: 5px"
            clearable
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="校区简称:">
          <el-input
            v-model="formData.campusShortName"
            style="width: 300px; margin-bottom: 5px"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="校区描述:">
          <el-input
            v-model="formData.describe"
            placeholder="校区描述"
            style="width: 300px; margin-bottom: 5px"
          ></el-input>
        </el-form-item>

        <el-form-item label="校区简介:">
          <el-input
            v-model="formData.shortDes"
            placeholder="校区简介"
            style="width: 300px; margin-bottom: 5px"
          ></el-input>
        </el-form-item>

        <el-form-item label="校区数据:">
          <el-input
            v-model="formData.data"
            placeholder="校区数据"
            style="width: 300px; margin-bottom: 5px"
          ></el-input>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="图片:">
          <el-image
            style="height: 50px; margin-right: 10px"
            :src="imageUrl"
            :preview-src-list="[imageUrl]"
            fit="contain"
          >
          </el-image>
          <input
            type="file"
            name="avatar"
            ref="fileType"
            @change="changeImage($event)"
          />
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
import { API_URL } from "@/config/index.js";
export default {
  data() {
    return {
      tableData: [],
      campusListAll: [],
      searchKey: "",
      currentPage: 1,
      pageSize: 5,
      total: 0,
      pageSizes: [5, 10, 20],
      diaIsShow: false,
      formData: {},
      editType: "",
      options: [
        { label: "正常", value: 0 },
        { label: "禁用", value: 1 },
      ],
      rowIndex: 0,
      imageUrl: "",
    };
  },
  created() {
    this._getCampusList();
  },
  filters: {
    campusShortNameText(val) {
      if (!val) return "-";
      return val;
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
      this._getCampusList();
    },
    handlePage(val) {
      this.currentPage = val;
      this._getCampusList();
    },
    /**
     * 查找
     */
    _getCampusList() {
      let campusId = "";
      this.tableData = [];
      getCampusList(campusId, this.currentPage, this.pageSize, this.searchKey)
        .then((res) => {
          for (let item of res.data) {
            let tmp = Object.assign({}, item);
            tmp.picUrl = API_URL + tmp.picUrl;
            this.tableData.push(tmp);
          }
          this.total = res.respPage.totalCount;
          this.campusListAll = [];
          for (let item of this.tableData) {
            this.campusListAll.push({
              id: item.campusId,
              campusName: item.campusName,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
      console.log(row);
      this.formData = Object.assign({}, row);
      this.editType = "update";
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
      this.rowIndex = index;
      this.imageUrl = this.formData.picUrl;
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
    changeImage(e) {
      let file = e.target.files[0];
      console.log(file);
      let reader = new FileReader();
      let that = this;
      reader.readAsDataURL(file);
      this.imageUrl = URL.createObjectURL(file);
      reader.onload = function (e) {
        //   that.avatar = this.result;
        //   this.imageUrl = URL.createObjectURL(this.result);
      };
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
.diaForm {
  .el-input {
    width: 300px;
    margin-bottom: 5px;
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
