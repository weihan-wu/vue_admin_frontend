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
        <el-button type="success" @click="handleCreate()">添加角色</el-button>
      </div>
    </action-bar>

    <el-card class="box-card">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名" prop="role_name"></el-table-column>

        <el-table-column label="状态" align="center">
          <template slot-scope="data">
            <el-switch
              v-model="data.row.role_delete_time"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              @change="changeroleStatus(data.$index, data.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="role_create_time"
        ></el-table-column>
        <el-table-column
          label="最后修改时间"
          prop="role_update_time"
        ></el-table-column>
        <el-table-column align="right">
          <template slot-scope="data">
            <el-button
              size="small"
              type="primary"
              :disabled="!data.row.role_delete_time"
              @click="handleEdit(data.$index, data.row.id)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="warning"
              :disabled="!data.row.role_delete_time"
              @click="handleAuth(data.$index, data.row.role_id)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
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
      :roleInfo="roleInfo"
    ></edit>

    <el-dialog title="分配角色" :visible.sync="roleDialogVisible">
      <el-tree
        :data="data"
        :props="props"
        ref="tree"
        default-expand-all
        show-checkbox
        node-key="rule_id"
        :default-checked-keys="default_checked_keys"
        @check-change="handleCheckChange"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleCancle()">取 消</el-button>
        <el-button type="primary" @click="roleSave()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import actionBar from "../../components/main/actionBar.vue";
import DataPicker from "../../components/main/dataPicker.vue";
import Edit from "./edit.vue";
export default {
  name: "Role",
  components: { actionBar, DataPicker, Edit },
  data() {
    return {
      disabled: false,
      roleDialogVisible: false,
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
          role_name: "",
          role_create_time: "",
          role_update_time: "",
          role_delete_time: "",
        },
      ],
      totalDatasLength: 0,
      //模态框内容
      roleInfo: {
        role_id: "",
        role_name: "",
      },
      props: {
        label: "rule_name",
        children: "children",
      },
      count: 1,
      data: [],
      default_checked_keys: [],
      checkRuleids: [],
      role_id: "",
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.loading = true;
      this.postRequest("role/role/index", this.searchDatas).then((res) => {
        if (res) {
          this.loading = false;
          res.data.items.forEach((item) => {
            item.role_delete_time = item.role_delete_time === null;
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
    changeroleStatus(index, row) {
      if (row.role_delete_time) {
        this.$confirm(`是否启用账户${row.role_name}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.getRequest("role/role/restore/id/" + row.role_id).then(
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
              message: "已取消启用该用户",
            });
            row.role_delete_time = false;
          });
      } else {
        this.$confirm(`是否禁用用户${row.role_name}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteRequest("role/role/delete/id/" + row.role_id).then(
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
              message: "已取消禁用该用户",
            });
            row.role_delete_time = true;
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
      this.roleInfo = {};
      this.changeEditViewState();
    },
    //初始化修改模态框
    handleEdit(index, row) {
      this.roleInfo = row;
      this.changeEditViewState();
    },
    handleAuth(_, id) {
      this.role_id = id;
      this.roleDialogVisible = true;
      this.getRequest(
        `roleauthority/Roleauthority/getRuleByRoleId?roleAuthority_role_id=${id}`
      ).then((res) => {
        if (res.data) {
          this.default_checked_keys = res.data;
        }
      });

      this.getRequest("roleauthority/Roleauthority/index").then((res) => {
        if (res.data) {
          this.data = res.data;
        }
      });
    },
    roleCancle() {
      this.roleDialogVisible = false;
      this.default_checked_keys = [];
      this.role_id = "";
      this.checkRuleids = [];
    },
    roleSave() {
      let postData = {
        roleAuthority_role_id: this.role_id,
        roleAuthority_rule_id: this.checkRuleids.toString(),
      };
      this.postRequest("roleauthority/Roleauthority/save", postData).then(
        (res) => {
          if (res.code === 1) {
            this.roleDialogVisible = false;
            this.role_id = "";
            this.checkRuleids = [];
          }
        }
      );
    },
    handleCheckChange() {
      let checkKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckKeys = this.$refs.tree.getHalfCheckedKeys()
      let allCheckKeys = checkKeys.concat(halfCheckKeys)
      allCheckKeys.sort(function(a, b){return a - b})
      this.checkRuleids = allCheckKeys;
    },
  },
};
</script>

<style lang="less" scope>
</style>