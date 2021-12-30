<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>学院分类管理</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="分类名称关键字"
          clearable
          class="width1"
          v-model="searchKey"
          @clear="handleSearch"
        ></el-input>
        <div class="vertical-center">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="handleSearch"
            >搜索</el-button
          >
          <el-button
            type="success"
            size="medium"
            icon="el-icon-plus"
            @click="toAdd"
            >新增</el-button
          >
          <el-button
            type="warning"
            size="medium"
            icon="el-icon-sort"
            @click="editTable"
            >编辑顺序</el-button
          >
        </div>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column
          prop="collegeTypeId"
          label="id"
          width="50"
          align="center"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="collegeTypeName"
          label="学院分类"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          align="center"
          width="100"
          prop="sortIndex"
          label="排序ID"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="180"
          prop="updateTime"
          label="修改时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime | emptyStr }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editRow(scope.$index, scope.row)"
              :disabled="scope.row.state == 0 ? false : true"
              >编辑</el-button
            >
            <el-popconfirm
              style="margin-left: 5px"
              title="确定删除该分类吗？"
              @confirm="toDelete(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                :disabled="scope.row.state == 0 ? false : true"
                >删除</el-button
              >
            </el-popconfirm>
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
      v-el-drag-dialog
      title="修改学院分类顺序"
      width="480px"
      :visible.sync="diaIsShow"
      class="diaForm"
    >
      <draggable
        v-model="tabData"
        chosenClass="chosen"
        forceFallback="true"
        animation="1000"
        group="sortIndex"
        @end="onEnd"
      >
        <transition-group>
          <div
            class="typeCard"
            v-for="(element, index) in tabData"
            :key="index"
          >
            {{ element.collegeTypeName }}
          </div>
        </transition-group>
      </draggable>

      <el-tabs style="margin-bottom: 30px" type="border-card">
        <el-tab-pane
          v-for="(item, index) in tabData"
          :key="index"
          :label="item.collegeTypeName"
          >{{ item.collegeTypeName }}</el-tab-pane
        >
      </el-tabs>

      <div class="updateSortBtn">
        <el-button type="primary" @click="updateSort">确定</el-button>
        <el-button @click="diaIsShow = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改分类信息"
      width="480px"
      :visible.sync="editRowShow"
      class="diaForm"
    >
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="学院名称：" prop="collegeTypeName">
          <el-input clearable v-model="formData.collegeTypeName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditRow">确定</el-button>
          <el-button @click="editRowShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="新增学院分类"
      width="480px"
      :visible.sync="addDialogShow"
      class="diaForm"
    >
      <el-form
        :model="formData"
        ref="diaForm"
        label-width="115px"
        :rules="rules"
      >
        <el-form-item label="学院类型名称:" prop="collegeTypeName">
          <el-input
            v-model="formData.collegeTypeName"
            placeholder="请输入分类类型"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="排序序号:">
          <el-input
            v-model="formData.sortIndex"
            type="number"
            placeholder="请输入排序序号"
            disabled
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">下一步</el-button>
          <el-button @click="addDialogShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCollegeTypeList,
  insertCollegeType,
  updateCollegeType,
} from "@/api/collegeData.js";
import { ITEM_STATE } from "@/config";
import elDragDialog from "@/directive/el-drag-dialog";
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  directives: { elDragDialog },
  data() {
    return {
      campusId: 6,
      campusList: [],
      searchKey: "",
      tableData: [],

      // 分页相关
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5, 10, 20],

      diaIsShow: false,
      tabData: [],

      formData: {},
      rules: {
        collegeTypeName: [
          { required: true, message: "类型名称不能为空", trigger: "blur" },
        ],
      },
      rowIndex: Number,
      editRowShow: false,

      addDialogShow: false,
    };
  },
  filters: {
    emptyStr(val) {
      if (!val) return "-";
      return val;
    },
  },
  created() {
    this._getCollegeTypeList();
  },
  methods: {
    handleSize(val) {
      this.pageSize = val;
      this._getCollegeTypeList(this.currentPage, this.pageSize, this.searchKey);
    },
    handlePage(val) {
      this.currentPage = val;
      this._getCollegeTypeList(this.currentPage, this.pageSize, this.searchKey);
    },
    handleSearch() {
      this._getCollegeTypeList();
    },
    _getCollegeTypeList() {
      return getCollegeTypeList(this.currentPage, this.pageSize, this.searchKey)
        .then((res) => {
          this.tableData = Object.assign([], res.data);
          this.total = res.respPage.totalCount;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    toAdd() {
      this.addDialogShow = true;
      this.formData = {};
      this.formData.sortIndex = this.total + 1;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
    handleAdd() {
      let form = new FormData();
      form.append("collegeTypeName", this.formData.collegeTypeName);
      form.append("sortIndex", this.formData.sortIndex);
      form.append("token", "886a");
      insertCollegeType(form).then(async (res) => {
        this.$message.success(res.msg);
        this.addDialogShow = false;
        await this._getCollegeTypeList();
        this.editTable();
      });
    },
    editTable() {
      // this.tabData = [...this.tableData] 不可！！
      // 对象数组只能这样deepCopy
      this.tabData = [];
      for (let obj of this.tableData) {
        this.tabData.push(Object.assign({}, obj));
      }
      this.tabData.sort((a, b) => a.sortIndex - b.sortIndex);
      this.diaIsShow = true;
    },
    editRow(index, row) {
      this.formData = Object.assign({}, row);
      this.rowIndex = index;
      this.editRowShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
    submitEditRow() {
      let form = new FormData();
      form.append("collegeTypeId", this.formData.collegeTypeId);
      form.append("collegeTypeName", this.formData.collegeTypeName);
      form.append("token", "886a");
      updateCollegeType(form)
        .then((res) => {
          this.$message.success(res.msg);
          this.editRowShow = false;
          this._getCollegeTypeList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    toDelete(row) {
      let form = new FormData();
      form.append("collegeTypeId", row.collegeTypeId);
      form.append("state", ITEM_STATE.DELETED);
      form.append("token", "886a");
      updateCollegeType(form)
        .then((res) => {
          this.$message.success(res.msg);
          this._getCollegeTypeList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    onEnd() {
      // 处理重新排序后的tab
      for (let index in this.tabData) {
        this.tabData[+index].sortIndex = +index + 1;
      }
    },
    updateSort() {
      let promises = [];
      for (let ele of this.tabData) {
        let form = new FormData();
        form.append("collegeTypeId", ele.collegeTypeId);
        form.append("sortIndex", ele.sortIndex);
        form.append("token", "886a");
        promises.push(updateCollegeType(form));
      }
      Promise.all(promises)
        .then(() => {
          this.$message.success("操作成功");
          this.diaIsShow = false;
          this._getCollegeTypeList();
        })
        .catch((err) => {
          this.$message.error(err);
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
.typeCard {
  padding: 6px;
  background-color: #fdfdfd;
  border: solid 1px #eee;
  margin-bottom: 10px;
  cursor: move;
  font-size: 16px;
}
.typeCard:hover {
  background-color: #f1f1f1;
  cursor: move;
}
.chosen {
  border: solid 2px #3089dc !important;
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
    width: 250px;
    margin-bottom: 5px;
  }
  .tabs {
    margin-bottom: 50px;
  }
}
.updateSortBtn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
