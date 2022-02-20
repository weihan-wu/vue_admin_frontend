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
        <el-input v-model.number="ruleForm.role_id"></el-input>
      </el-form-item>

      <el-form-item label="管理员名称" prop="role_name" class="edit-input">
        <el-input v-model="ruleForm.role_name"></el-input>
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
        role_id: "",
        role_name: "",
      },
      rules: {
        role_name: [{ required: true, message: "请输入管理员名称", trigger: "blur" }]
      },
    };
  },
  props: {
    dialogVisible: Boolean,
    roleInfo: Object,
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
          this.postRequest("role/role/save", this.ruleForm).then((res) => {
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
    roleInfo() {
      let {role_id,role_name} = this.roleInfo
      this.ruleForm.role_id = role_id
      this.ruleForm.role_name = role_name
    },
  },
  computed: {
    createBtn() {
      return this.ruleForm.role_id === undefined;
    },
    saveBtn() {
      return this.ruleForm.role_id !== undefined;
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
