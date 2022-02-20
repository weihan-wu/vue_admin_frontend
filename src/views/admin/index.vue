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
        <el-button type="success" @click="handleCreate()">添加管理员</el-button>
      </div>
    </action-bar>

    <el-card class="box-card">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="admin_username"></el-table-column>
        <el-table-column
          label="联系电话"
          prop="admin_telphone"
        ></el-table-column>
        <el-table-column
          label="电子邮箱"
          prop="admin_email"
          width="160"
        ></el-table-column>
        <el-table-column
          label="真实姓名"
          prop="admin_truename"
          width="100px"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="data">
            <el-switch
              v-model="data.row.admin_delete_time"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁用"
              @change="changeAdminStatus(data.$index, data.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="160"
          prop="admin_create_time"
        ></el-table-column>
        <el-table-column
          label="最后修改时间"
          width="160"
          prop="admin_update_time"
        ></el-table-column>
        <el-table-column align="right" fixed="right">
          <template slot-scope="data">
            <el-button
              size="small"
              type="primary"
              circle
              icon="el-icon-edit"
              :disabled="!data.row.admin_delete_time"
              @click="handleEdit(data.$index, data.row)"
            ></el-button>
            <el-button
              size="small"
              type="warning"
              circle
              icon="el-icon-user-solid"
              :disabled="!data.row.admin_delete_time"
              @click="assignRoles(data.$index, data.row)"
            ></el-button>
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
      :adminInfo="adminInfo"
    ></edit>

    <el-dialog title="分配角色" :visible.sync="authDialogVisible">
      <el-form :model="authForm">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(item,index) in role_list" :key="index" :label="item.role_id">{{item.role_name}}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authCancle()">取 消</el-button>
        <el-button type="primary" @click="authSave()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import actionBar from "../../components/main/actionBar.vue";
import DataPicker from "../../components/main/dataPicker.vue";
import Edit from "./edit.vue";
export default {
  name: "Admin",
  components: { actionBar, DataPicker, Edit },
  data() {
    return {
      disabled: false,
      iDialogVisible: false,
      authDialogVisible: false,
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
          admin_username: "",
          admin_telphone: "",
          admin_email: "",
          admin_truename: "",
          admin_delete_time: "",
          admin_create_time: "",
          admin_update_time: "",
        },
      ],
      totalDatasLength: 0,
      //模态框内容
      adminInfo: {
        admin_id: "",
        admin_username: "",
        admin_password: "",
        admin_telphone: "",
        admin_email: "",
        admin_truename: "",
      },
      authForm: {
        id: "",
        role_ids: {},
      },

      role_list: [],
      checkList:[],
      adminrole_admin_id:''
    };
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      this.loading = true;
      this.postRequest("admin/admin/index", this.searchDatas).then((res) => {
        if (res) {
          this.loading = false;
          res.data.items.forEach((item) => {
            item.admin_delete_time = item.admin_delete_time === null;
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
    changeAdminStatus(index, row) {
      if (row.admin_delete_time) {
        this.$confirm(`是否启用账户${row.admin_username}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.getRequest("admin/Admin/restore/id/" + row.admin_id).then(
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
            row.admin_delete_time = false;
          });
      } else {
        this.$confirm(`是否禁用用户${row.admin_username}？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteRequest("admin/Admin/delete/id/" + row.admin_id).then(
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
            row.admin_delete_time = true;
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
      this.adminInfo = {};
      this.changeEditViewState();
    },
    //初始化修改模态框
    handleEdit(index, row) {
      this.adminInfo = row;
      this.changeEditViewState();
    },
    assignRoles(index, row) {
      console.log(row.admin_id)
      this.adminrole_admin_id = row.admin_id
      this.authDialogVisible = true;
      // 管理员已拥有的角色
      this.getRequest(`adminrole/adminrole/hasRoles?admin_id=${row.admin_id}`).then((res) => {
        console.log(res.data)
        this.checkList = res.data
      })

      // 系统中所有角色
      this.getRequest("adminrole/adminrole/index").then((res) => {
        if (res.data) {
          this.role_list = res.data;
        }
      });
    },
    authSave() {
      this.authDialogVisible = false;
      let postData = {
        adminrole_admin_id : this.adminrole_admin_id,
        adminrole_role_id : this.checkList.sort().toString()
      }
      this.postRequest('adminrole/adminrole/save',postData).then(res => {
        console.log(res)
      })
    },
    authCancle() {
      this.authDialogVisible = false;
      this.adminrole_admin_id = ''
      this.checkList = []
    }
  },
};
</script>
