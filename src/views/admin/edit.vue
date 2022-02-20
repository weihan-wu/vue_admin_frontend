<template>
  <el-dialog
    title="编辑管理员信息"
    :visible.sync="dialogVisible"
    width="30%"
    center
    :before-close="handleClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item hidden>
        <el-input v-model.number="ruleForm.admin_id"></el-input>
      </el-form-item>

      <el-form-item label="管理员名称" prop="admin_username" class="edit-input">
        <el-input v-model="ruleForm.admin_username"></el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="admin_telphone" class="edit-input">
        <el-input v-model="ruleForm.admin_telphone"></el-input>
      </el-form-item>

      <el-form-item label="电子邮箱" prop="admin_email" class="edit-input">
        <el-input v-model="ruleForm.admin_email"></el-input>
      </el-form-item>

      <el-form-item label="真实姓名" class="edit-input" prop="admin_truename">
        <el-input v-model="ruleForm.admin_truename"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="resetForm('ruleForm')" v-show="createBtn"
        >重置</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submitForm('ruleForm')"
        v-show="createBtn"
        >确 定</el-button
      >
      <el-button
        type="success"
        size="small"
        @click="submitForm('ruleForm')"
        v-show="saveBtn"
        >保存修改</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "edit",
  data() {
    return {
      ruleForm: {
        admin_id: "",
        admin_username: "",
        admin_telphone: "",
        admin_email: "",
        admin_truename: ""
      },
      rules: {
        admin_username: [{ required: true, message: "请输入管理员名称", trigger: "blur" }],
        admin_telphone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { min: 11, message: "请输入正确的联系电话", trigger: "blur" },
        ],
        admin_email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        admin_truename: [
          { required: true, message: "请选择联系地址", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    dialogVisible: Boolean,
    adminInfo: Object,
  },
  methods: {
    handleClose() {
      this.$confirm("确认关闭？")
        .then(() => {
          this.$emit("closeEditView");
          this.resetForm("ruleForm");
        })
        .catch(() => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest("admin/admin/save", this.ruleForm).then((res) => {
              if (res) {
                this.$emit("closeEditView");
              }
            }
          );
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  watch: {
    adminInfo() {
      let {admin_id,admin_username,admin_telphone,admin_truename,admin_email} = this.adminInfo
      this.ruleForm.admin_id = admin_id
      this.ruleForm.admin_username = admin_username
      this.ruleForm.admin_telphone = admin_telphone
      this.ruleForm.admin_truename = admin_truename
      this.ruleForm.admin_email = admin_email
    },
  },
  computed: {
    createBtn() {
      return this.ruleForm.admin_id === undefined;
    },
    saveBtn() {
      return this.ruleForm.admin_id !== undefined;
    },
  },
};
</script>

<style scoped>
.edit-input {
  width: 70%;
}

.edit-textarea {
  width: 80%;
}
</style>
