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
        <el-input v-model.number="ruleForm.rule_id"></el-input>
      </el-form-item>

      <el-form-item label="功能名" prop="rule_name" class="edit-input">
        <el-input v-model="ruleForm.rule_name"></el-input>
      </el-form-item>

      <el-form-item label="功能路由" prop="rule_path" class="edit-input">
        <el-input v-model="ruleForm.rule_path"></el-input>
      </el-form-item>

      <el-form-item label="功能图标" prop="rule_icon" class="edit-input">
        <el-input v-model="ruleForm.rule_icon"></el-input>
      </el-form-item>

      <el-form-item label="父级路由" class="edit-input" prop="rule_pid">
        <el-input v-model="ruleForm.rule_pid"></el-input>
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
        rule_id: "",
        rule_name: "",
        rule_path: "",
        rule_icon: "",
        rule_pid: ""
      },
      rules: {
        rule_name: [{ required: true, message: "请输入功能名", trigger: "blur" }],
        rule_path: [
          { required: true, message: "请输入功能路由", trigger: "blur" }
        ],
        rule_icon: [
          { required: true, message: "请输入功能图标", trigger: "blur" }
        ],
        rule_pid: [
          { required: true, message: "请输入父级路由ID", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    dialogVisible: Boolean,
    ruleInfo: Object,
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
          this.postRequest("rule/rule/save", this.ruleForm).then((res) => {
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
    ruleInfo() {
      let {rule_id,rule_name,rule_path,rule_icon,rule_pid} = this.ruleInfo
      this.ruleForm.rule_id = rule_id
      this.ruleForm.rule_name = rule_name
      this.ruleForm.rule_path = rule_path
      this.ruleForm.rule_icon = rule_icon
      this.ruleForm.rule_pid = rule_pid
    },
  },
  computed: {
    createBtn() {
      return this.ruleForm.rule_id === undefined;
    },
    saveBtn() {
      return this.ruleForm.rule_id !== undefined;
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
