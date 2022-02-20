<template>
  <div>
    <action-bar>
      <div slot="left">
        <el-input
          placeholder="关键字搜索"
          prefix-icon="el-icon-search"
          v-model="searchDatas.keywords"
          @change="search"
          clearable
          class="search-input"
        >
        </el-input>
        <data-picker @data-change="dataChange"></data-picker>
      </div>
      <div slot="right">
        <!-- <el-button type="success" @click="handleCreate()">添加路由规则</el-button> -->
      </div>
    </action-bar>

    <el-card class="box-card">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="功能名" prop="rule_name" width="100"></el-table-column>
        <el-table-column label="功能路由" prop="rule_path" width="200"></el-table-column>
        <el-table-column label="功能图标" prop="rule_icon"  width="200"></el-table-column>
        <el-table-column
          label="组件"
          prop="rule_component"
          width="200px"
        ></el-table-column>
        <!-- <el-table-column label="状态" align="center">
          <template slot-scope="data">
            <el-switch
              v-model="data.row.rule_delete_time"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              @change="changeruleStatus(data.$index, data.row)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column
          label="创建时间"
          prop="rule_create_time"
        ></el-table-column>
        <el-table-column
          label="最后修改时间"
          prop="rule_update_time"
        ></el-table-column>
        <!-- <el-table-column align="right">
          <template slot-scope="data">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              circle :disabled='!data.row.rule_delete_time'
              @click="handleEdit(data.$index, data.row)"
            ></el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <div class="pages-change">
        <el-pagination
          background
          :page-sizes="[5, 10, 15, 20]"
          :page-size="this.searchDatas.size"
          :current-page="this.searchDatas.page"
          layout=" total, sizes, prev, pager, next, jumper"
          :total="totalDatasLength"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
    <edit
      :dialogVisible="iDialogVisible"
      @closeEditView="changeEditViewState"
      :ruleInfo="ruleInfo"
    ></edit>
  </div>
</template>

<script>
import actionBar from "../../components/main/actionBar.vue";
import DataPicker from "../../components/main/dataPicker.vue";
import Edit from "./edit.vue";
export default {
  name: "Rule",
  components: { actionBar, DataPicker, Edit },
  data() {
    return {
      disabled:false,
      iDialogVisible: false,
      loading: false,
      searchDatas: {
        keywords: "",
        begin_time: "",
        end_time: "",
        // 当前第几页
        page: 1,
        // 每页几条数据
        size: 5,
      },
      tableData: [
        {
          rule_name: "",
          rule_path: "",
          rule_icon: "",
          rule_component: "",
          rule_delete_time: "",
          rule_create_time: "",
          rule_update_time: "",
        },
      ],
      totalDatasLength: 0,
      //模态框内容
      ruleInfo: {
        rule_id: "",
        rule_name: "",
          rule_path: "",
          rule_icon: "",
          rule_pid: ""
      },
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.loading = true;
      this.postRequest("rule/rule/index", this.searchDatas).then((res) => {
        if (res) {
          this.loading = false;
          res.data.items.forEach((item) => {
            item.rule_delete_time = item.rule_delete_time === null;
          });
          this.tableData = res.data.items;
          this.totalDatasLength = res.data.total;
        }
      });
    },
    //时间范围选择器取值
    dataChange(value2) {
      this.searchDatas.begin_time = value2[0];
      this.searchDatas.end_time = value2[1];
      this.search();
    },
    //每页显示几条
    handleSizeChange(val) {
      this.searchDatas.size = val;
      this.search();
    },
    //当前第几页
    handleCurrentChange(val) {
      this.searchDatas.page = val;
      this.search();
    },
    changeruleStatus(index, row) {
      if (row.rule_delete_time) {
        this.$confirm(`是否启用路由${row.rule_name}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.getRequest("rule/rule/restore/id/" + row.rule_id).then(
              (res) => {
                this.loading = true;
                if (res) {
                  this.loading = false;
                  this.search();
                }
              }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消启用该路由",
            });
            row.rule_delete_time = false;
          });
      } else {
        this.$confirm(`是否禁用路由${row.rule_name}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteRequest("rule/rule/delete/id/" + row.rule_id).then(
              (res) => {
                this.loading = true;
                if (res) {
                  this.loading = false;
                  this.search();
                } else {
                  this.loading = false;
                  this.search();
                }
              }
            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消禁用该路由",
            });
            row.rule_delete_time = true;
          });
      }
    },
    //模态框开闭
    changeEditViewState() {
      this.iDialogVisible = !this.iDialogVisible;
      if (this.iDialogVisible === false) {
        this.search();
      }
    },
    //初始化创建模态框
    handleCreate() {
      this.ruleInfo = {};
      this.changeEditViewState();
    },
    //初始化修改模态框
    handleEdit(index, row) {
      this.ruleInfo = row;
      this.changeEditViewState();
    },
  },
};
</script>

<style lang="less" scope>
</style>