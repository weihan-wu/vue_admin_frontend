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
        <el-button type="success" @click="handleCreate()">发布公告</el-button>
        <el-button
          type="danger"
          class="search-btn"
          :disabled="this.multipleSelection.length === 0"
          @click="deleteMany"
          >批量删除</el-button
        >
      </div>
    </action-bar>

    <el-card class="box-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60"> </el-table-column>
        <el-table-column label="标题" prop="an_title" width="200"></el-table-column>
        <el-table-column label="作者" prop="an_authorname" width="150"></el-table-column>

        <el-table-column
          width="220"
          label="发布时间"
          prop="an_create_time"
        ></el-table-column>
        <el-table-column
          width="220"
          label="最后修改时间"
          prop="an_update_time"
        ></el-table-column>
        <el-table-column align="right" fixed="right">
          <template slot-scope="data">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(data.$index, data.row.an_id)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(data.$index, data.row)"
              >删除</el-button
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
  </div>
</template>

<script>
import actionBar from "../../components/main/actionBar.vue";
import DataPicker from "../../components/main/dataPicker.vue";
export default {
  name: "Announcement",
  components: { actionBar, DataPicker },
  data() {
    return {
      disabled: false,
      multipleSelection: [],
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
          an_title: "",
          an_authorname: "",
          an_create_time: "",
          an_update_time: "",
          an_delete_time: "",
        },
      ],
      totalDatasLength: 0,
    };
  },
  created() {
    this.search();
  },
  activated() {
    this.search();
  },
  methods: {
    search() {
      this.loading = true;
      this.postRequest(
        "announcement/Announcement/index",
        this.searchDatas
      ).then((res) => {
        if (res.code) {
          this.loading = false;
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
    handleCreate() {
      this.$router.push("/announcement/edit");
    },
    handleEdit(_, id) {
      this.$router.push({
        path: "/announcement/edit",
        query: {
          id,
        },
      });
    },
    handleDelete(_, row) {
      this.$confirm(`是否删除公告${row.an_id}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRequest(
            "announcement/Announcement/delete?an_id=" + row.an_id
          ).then((res) => {
            this.loading = true;
            if (res) {
              this.loading = false;
              this.search();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //多选框取值
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    //多选删除
    deleteMany() {
      this.$confirm(
        `是否批量删除选中的${this.multipleSelection.length}条公告信息？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let ids = [];
          this.multipleSelection.forEach((item) => {
            ids.push(item.an_id);
          });
          this.deleteRequest("announcement/Announcement/delete/an_id/" + ids).then(
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
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scope>
</style>