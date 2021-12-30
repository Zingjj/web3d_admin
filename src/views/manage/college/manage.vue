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
          @change="_getCollegeList"
        >
          <el-option
            v-for="item in campusSelectOptions"
            :key="item.id"
            :label="item.campusName"
            :value="item.id"
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
          @change="_getCollegeList"
          @clear="_getCollegeList"
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
          @clear="_getCollegeList"
        ></el-input>
        <div class="vertical-center">
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click="_getCollegeList"
            >搜索</el-button
          >
          <el-button
            type="success"
            size="medium"
            icon="el-icon-plus"
            @click="toAdd"
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
          prop="updateTime"
          label="修改时间"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.updateTime | emptyStr }}
          </template>
        </el-table-column>
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
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
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
        <el-form-item label="校区名称：" prop="campusId">
          <el-select disabled v-model="formData.campusId">
            <el-option
              v-for="item in campusSelectOptions"
              :key="item.id"
              :label="'[' + item.id + ']' + item.campusName"
              :value="item.id"
              disabled
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院名称：" prop="collegeName">
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

        <el-form-item label="学院描述：" prop="describe">
          <el-input
            v-model="formData.describe"
            placeholder="学院描述"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="学院简介：" prop="shortDes">
          <el-input
            v-model="formData.shortDes"
            placeholder="学院简介"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="学院链接：" prop="webUrl">
          <el-input
            v-model="formData.webUrl"
            placeholder="学院链接"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="图片：" prop="picUrl">
          <el-image
            style="height: 50px; margin-right: 10px"
            :src="imageUrl"
            :preview-src-list="[imageUrl]"
            fit="contain"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <input
            type="file"
            name="avatar"
            ref="fileType"
            @change="changeImage($event)"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleUpdate"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 新增学院 -->
    <el-dialog
      title="新增学院信息"
      width="480px"
      :visible.sync="addDiaShow"
      class="diaForm"
    >
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item label="校区名称：" prop="campusId">
          <el-select v-model="formData.campusId" disabled>
            <el-option
              v-for="item in campusSelectOptions"
              :key="item.id"
              :label="'[' + item.id + ']' + item.campusName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院名称：" prop="collegeName">
          <el-input v-model="formData.collegeName"></el-input>
        </el-form-item>

        <el-form-item label="学院类型：" prop="collegeTypeId">
          <el-select clearable v-model="formData.collegeTypeId">
            <el-option
              v-for="item in collegeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
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

        <el-form-item label="学院描述：" prop="describe">
          <el-input
            v-model="formData.describe"
            placeholder="学院描述"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="学院简介：" prop="shortDes">
          <el-input
            v-model="formData.shortDes"
            placeholder="学院简介"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="学院链接：" prop="webUrl">
          <el-input
            v-model="formData.webUrl"
            placeholder="学院链接"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="图片：" prop="picUrl">
          <el-image
            style="height: 50px; margin-right: 10px"
            :src="imageUrl"
            :preview-src-list="[imageUrl]"
            fit="contain"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <input
            type="file"
            name="avatar"
            ref="fileType"
            @change="changeImage($event)"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">确认</el-button>
          <el-button @click="addDiaShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
  </div>
</template>

<script>
import {
  getCollegeList,
  getCollegeTypeList,
  updateCollegeData,
  insertCollegeData,
} from "@/api/collegeData";
import { getBuildingList } from "@/api/buildingData";
import { API_URL, ITEM_STATE } from "@/config";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["campusSelectOptions"]),
  },
  data() {
    return {
      campusId: 6,
      tableData: [],

      searchKey: "",
      // 分页相关
      currentPage: 1,
      pageSize: 5,
      total: 0,
      pageSizes: [5, 10, 20],

      diaIsShow: false,
      editType: "",

      rowIndex: 0,
      formData: {},
      imageUrl: "",

      rules: {
        campusId: [
          { required: true, message: "学院名称不能为空", trigger: "blur" },
        ],
        collegeName: [
          { required: true, message: "学院名称不能为空", trigger: "blur" },
        ],
        collegeTypeId: [
          { required: true, message: "学院类型不能为空", trigger: "blur" },
        ],
        buildId: [
          { required: true, message: "所属建筑不能为空", trigger: "blur" },
        ],
      },
      collegeTypeList: [],
      collegeTypeId: "",

      buildingList: [],

      addDiaShow: false,
    };
  },
  created() {
    this._getCollegeList();
    this._getCollegeTypeList();
  },
  filters: {
    emptyStr(val) {
      if (!val) return "-";
      return val;
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
    handleSize(val) {
      this.pageSize = val;
      this._getCollegeList();
    },
    handlePage(val) {
      this.currentPage = val;
      this._getCollegeList();
    },

    _getCollegeTypeList() {
      getCollegeTypeList()
        .then((res) => {
          this.collegeTypeList = [];
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
    /**
     * 获取当前校区的建筑列表
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
    /**
     * 查找
     * by Type or by key
     */
    _getCollegeList() {
      getCollegeList(
        this.campusId,
        this.currentPage,
        this.pageSize,
        this.collegeTypeId,
        this.searchKey
      ).then((res) => {
        this.tableData = [];
        for (let item of res.data) {
          let tmp = Object.assign({}, item);
          tmp.picUrl = API_URL + tmp.picUrl;
          this.tableData.push(tmp);
        }
        this.total = res.respPage.totalCount;
        this._getBuildingList();
      });
    },
    /**
     * 新增学院
     */
    toAdd() {
      this.formData = {};
      this.formData.campusId = this.campusId || null;
      this.addDiaShow = true;
      this.imageUrl = "";
    },
    handleAdd() {
      let form = new FormData();
      for (let key in this.formData) {
        form.append(key, this.formData[key]);
      }
      form.append("file", this.$refs.fileType.files[0]);
      form.append("token", "886a");

      insertCollegeData(form).then((res) => {
        this.$message.success(res.msg);
        this.addDiaShow = false;
        this._getCollegeList();
      }).catch((err) => {
        console.log(err);
      });
    },
    /**
     * 修改学院信息
     */
    handleUpdate() {
      let form = new FormData();
      form.append("collegeId", this.formData.collegeId);
      form.append("collegeTypeId", this.formData.collegeTypeId);
      form.append("campusId", this.formData.campusId);
      form.append("buildId", this.formData.buildId);
      form.append("shortDes", this.formData.shortDes);
      form.append("webUrl", this.formData.webUrl);
      form.append("videoUrl", this.formData.videoUrl);
      form.append("describe", this.formData.describe);

      form.append("file", this.$refs.fileType.files[0]);
      form.append("token", "886a");

      updateCollegeData(form).then((res) => {
        this.$message.success(res.msg);
        this.diaIsShow = false;
        this._getCollegeList();
      }).catch((err) => {
        console.log(err);
      });
    },
    // 删除
    toDelete(row) {
      let form = new FormData();
      form.append("collegeId", row.collegeId);
      form.append("state", ITEM_STATE.DELETED);
      form.append("token", "886a");
      updateCollegeData(form)
        .then((res) => {
          this.$message.success(res.msg);
          this._getCollegeList();
        })
        .catch((err) => {
          this.$message.error(err.message);
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
      this.imageUrl = this.formData.picUrl;
      this.rowIndex = index;
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

/* 图片上传相关 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
