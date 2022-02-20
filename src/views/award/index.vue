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
        <el-button type="success" @click="handleCreate">上架奖品</el-button>
        <el-button
          type="primary"
          @click="exportExcel"
          :disabled="this.multipleSelection.length === 0"
          >导出表格</el-button
        >
      </div>
    </action-bar>

    <el-card class="box-card">
      <el-table
        height="400"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="60"> </el-table-column>
        <el-table-column
          label="奖品名称"
          prop="award_name"
          :show-overflow-tooltip="true"
          width="180"
        ></el-table-column>
        <el-table-column label="兑奖标准" width="120" align="center">
          <template slot-scope="data">
            <el-tag>{{ data.row.award_standard }}积分</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="奖品图片" width="150" align="center">
          <template slot-scope="data">
            <el-image
              style="width: 100px; height: 100px"
              :src="data.row.award_image"
              fit="fill"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="奖品库存" width="100" align="center">
          <template slot-scope="data">
            <el-tag v-show="data.row.award_stocks !== 0" type="success">{{
              data.row.award_stocks
            }}</el-tag>
            <el-tag v-show="data.row.award_stocks === 0" type="danger"
              >库存不足</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="单位"
          prop="award_unit"
        ></el-table-column>
        <el-table-column label="状态" align="center" width="150">
          <template slot-scope="data">
            <el-switch
              v-model="data.row.award_delete_time"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="上架"
              inactive-text="下架"
              @change="changeAwardStatus(data.$index, data.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="award_create_time"
          width="120"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="最后修改时间"
          width="120"
          :show-overflow-tooltip="true"
          prop="award_update_time"
        ></el-table-column>
        <el-table-column fixed="right" width="150" label="操作" align="center">
          <template slot-scope="data">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(data.$index, data.row.award_id)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(data.$index, data.row.award_id)"
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

    <el-dialog title="导出数据浏览" width="70%" :visible.sync="exportWindow">
      <el-table :data="multipleSelection" id="exportTable" height="380px">
        <el-table-column prop="award_id" label="编号"></el-table-column>
        <el-table-column prop="award_name" label="名称"></el-table-column>
        <el-table-column
          prop="award_standard"
          label="兑奖标准"
        ></el-table-column>
        <el-table-column prop="award_stocks" label="库存"></el-table-column>
        <el-table-column prop="award_unit" label="单位"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="exportWindow = false">取 消</el-button>
        <el-button type="primary" @click="handelExport">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import actionBar from "../../components/main/actionBar.vue";
import DataPicker from "../../components/main/dataPicker.vue";
import toExcel from "../../utils/toExcel";
export default {
  name: "Award",
  components: { actionBar, DataPicker },
  created() {
    this.search();
  },
  activated() {
    this.search();
  },
  data() {
    return {
      loading: true,
      searchDatas: {
        keywords: "",
        begin_time: "",
        end_time: "",
        page: 1,
        size: 5,
      },
      tableData: [
        {
          award_id: "",
          award_name: "",
          award_standard: "",
          award_image: "",
          award_stocks: "",
          award_unit: "",
          award_create_time: "",
          award_update_time: "",
        },
      ],
      totalDatasLength: 0,
      multipleSelection: [],
      exportWindow: false,
    };
  },
  methods: {
    search() {
      this.loading = true;
      this.postRequest("award/Award/index", this.searchDatas).then((res) => {
        if (res.code) {
          this.loading = false;
          res.data.items.forEach((item) => {
            item.award_delete_time = item.award_delete_time === null;
          });
          this.tableData = res.data.items;
          this.totalDatasLength = res.data.total;
        }
      });
    },
    //时间范围选择器取值
    dataChange(value) {
      this.searchDatas.begin_time = value[0];
      this.searchDatas.end_time = value[1];
      this.search();
    },
    handleCreate() {
      this.$router.push("/award/edit");
    },
    handleEdit(_, id) {
      this.$router.push({
        path: "/award/edit",
        query: {
          id,
        },
      });
    },
    handleSizeChange(val) {
      this.searchDatas.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.searchDatas.page = val;
      this.search();
    },
    handleDelete(index, id) {
      this.$confirm(`是否删除该商品？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.getRequest("award/Award/destory/award_id/" + id).then((res) => {
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
            message: "操作取消",
          });
        });
    },
    changeAwardStatus(index, row) {
      if (row.award_delete_time) {
        this.$confirm(`是否重新上架该商品？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.getRequest(
              "award/Award/restore/award_id/" + row.award_id
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
              message: "操作取消",
            });
            row.award_delete_time = false;
          });
      } else {
        this.$confirm(`是否下架该商品？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteRequest(
              "award/Award/delete/award_id/" + row.award_id
            ).then((res) => {
              this.loading = true;
              if (res) {
                this.loading = false;
                this.search();
              } else {
                this.loading = false;
                this.search();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "操作取消",
            });
            row.award_delete_time = true;
          });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    exportExcel() {
      this.exportWindow = true;
    },
    handelExport() {
      toExcel.getExcel("#exportTable", "奖品清单");
      this.exportWindow = false;
    },
  },
};
</script>

<style>
</style>