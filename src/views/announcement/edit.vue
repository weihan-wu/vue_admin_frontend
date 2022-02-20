<template>
  <div>
    <el-card>
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="公告编号" prop="an_id" hidden>
          <el-input
            v-model="ruleForm.an_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告标题" prop="an_title">
          <el-input
            v-model="ruleForm.an_title"
            placeholder="请输入公告标题"
          ></el-input>
        </el-form-item>

        <el-form-item label="公告内容" prop="an_content">
          <el-input
            class="edit-input"
            v-model="ruleForm.an_content"
            readonly
            style="display: none"
          ></el-input>
        </el-form-item>

        <quill-editor
          class="quill-editor"
          ref="myQuillEditor"
          v-model="ruleForm.an_content"
          :options="editorOption"
          @change="onEditorChange($event)"
        />

        <el-form-item class="btn-group">
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  name: "edit",
  data() {
    return {
      editorOption: {
        placeholder: "请输入公告内容",
      },
      imageUrl: "",
      ruleForm: {
        an_title: "",
        an_content: "",
        an_author: JSON.parse(window.sessionStorage.getItem("userinfo"))
          .admin_id,
      },
      rules: {
        an_title: [
          { required: true, message: "请输入公告标题", trigger: "blur" },
        ],
        an_content: [
          { required: true, message: "请填写公告内容", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    quillEditor,
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.ruleForm.an_content = html;
      console.log(this.ruleForm);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest(
            "announcement/Announcement/save",
            this.ruleForm
          ).then((res) => {
            if (res) {
              this.ruleForm = {};
              this.$router.replace("/announcement/index");
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
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
  activated() {
    this.ruleForm.an_id = Number(this.$route.query.id);
    this.getRequest(
      `announcement/Announcement/getOne?an_id=${this.ruleForm.an_id}`
    ).then((res) => {
      if (res.data !== null) {
        let { an_id, an_title, an_content, an_author } = res.data;
        let anInfo = {
          an_id,
          an_title,
          an_content,
          an_author,
        };
        this.ruleForm = anInfo;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.ruleForm.an_title || this.ruleForm.an_content) {
      this.$confirm("有编辑内容尚未保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.ruleForm = {};
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

<style scope>
@import "./components/css/zn-cn.css";
.edit-input {
  opacity: 0;
  pointer-events: none;
}
.quill-editor {
  margin: 0;
  padding: 0;
  line-height: 22px;
  margin-bottom: 50px;
  height: 200px;
}
</style>