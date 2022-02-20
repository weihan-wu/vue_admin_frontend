<template>
  <div>
    <el-card>
      <el-form
        label-position="left"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="奖品编号" prop="award_id" hidden>
          <el-input
            v-model="ruleForm.award_id"
          ></el-input>
        </el-form-item>

        <el-form-item label="奖品名称" prop="award_name">
          <el-input
            style="width: 221px"
            v-model="ruleForm.award_name"
            placeholder="请填写奖品名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="奖品图片" prop="award_image">
          <el-upload
            class="avatar-uploader"
            action="/userApi/qcloud/qcloud/upload"
            :headers="uploadHeader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="ruleForm.award_image"
              :src="ruleForm.award_image"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="兑奖标准" prop="award_standard">
          <el-slider
            v-model="ruleForm.award_standard"
            show-input
            :min="1"
            :max="10000"
          >
          </el-slider>
        </el-form-item>
        <div class="inline-container">
          <el-form-item
            label="库存数量"
            prop="award_stocks"
            style="display: inline-block"
          >
            <el-input
              style="width: 221px"
              v-model="ruleForm.award_stocks"
              number
              class="stock-input"
              placeholder="请填写库存数量"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="单位"
            prop="award_unit"
            style="display: inline-block"
          >
            <el-select v-model="ruleForm.award_unit" placeholder="请选择单位">
              <el-option label="瓶" value="瓶"></el-option>
              <el-option label="箱" value="箱"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="奖品概述" prop="award_detail">
          <el-input
            type="textarea"
            v-model="ruleForm.award_detail"
            placeholder="请填写奖品概述"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保存</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AwardEdit",
  data() {
    return {
      ruleForm: {
        award_name: "",
        award_image: "",
        award_image_cdn: "",
        award_image_key: "",
        award_standard: 1,
        award_stocks: null,
        award_unit: "",
        award_detail: "",
      },
      rules: {
        award_name: [
          { required: true, message: "请输入奖品名称", trigger: "blur" },
        ],
        award_image: [
          { required: true, message: "请上传图片", trigger: "blur" },
        ],
        award_standard: [
          { required: true, message: "请输入兑奖所需积分", trigger: "change" },
        ],
        award_stocks: [
          { required: true, message: "请输入库存数量", trigger: "blur" },
        ],
        award_unit: [
          { required: true, message: "请选择奖品单位", trigger: "blur" },
        ],
        award_detail: [
          { required: true, message: "请填写奖品概述", trigger: "blur" },
        ],
      },
      uploadHeader: {
        token: window.sessionStorage.getItem("tokenStr"),
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest("award/Award/save", this.ruleForm).then((res) => {
            if (res.code) {
              this.ruleForm = {};
              this.$router.replace("/award/index");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 上传成功的回调函数
    handleAvatarSuccess(res) {
      let { Location, CDNLocation, Key } = res.data;
      this.ruleForm.award_image = Location;
      this.ruleForm.award_image_cdn = CDNLocation;
      this.ruleForm.award_image_key = Key;
    },
    // 上传之前的处理函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
  activated() {
    this.ruleForm.award_id = Number(this.$route.query.id);
    this.getRequest(
      `award/Award/getOne?award_id=${this.ruleForm.award_id}`
    ).then((res) => {
      if (res.data !== null) {
        let {
          award_id,
          award_name,
          award_image,
          award_image_cdn,
          award_image_key,
          award_standard,
          award_stocks,
          award_unit,
          award_detail,
        } = res.data;
        let awardInfo = {
          award_id,
          award_name,
          award_image,
          award_image_cdn,
          award_image_key,
          award_standard,
          award_stocks,
          award_unit,
          award_detail,
        };
        this.ruleForm = awardInfo;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (
      this.ruleForm.award_name ||
      this.ruleForm.award_image ||
      this.ruleForm.award_stocks ||
      this.ruleForm.award_unit ||
      this.ruleForm.award_detail
    ) {
      this.$confirm("有编辑内容尚未保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.resetForm('ruleForm');
          next();
        })
        .catch(() => {
          return;
        });
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  border: 1px solid rgb(218, 221, 228);
  border-radius: 6px;
  font-size: 28px;
  color: rgb(218, 221, 228);
  width: 165px;
  height: 165px;
  line-height: 165px;
  text-align: center;
  transition: all 0.5s ease;
}

.avatar-uploader-icon:hover {
  border: 1px solid rgb(192, 196, 204);
  color: rgb(192, 196, 204);
}
.avatar {
  width: 165px;
  height: 165px;
  display: block;
}

.inline-container {
  display: flex;
  justify-content: space-between;
  width: 70%;
}
</style>