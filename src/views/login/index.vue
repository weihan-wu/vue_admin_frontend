<template>
  <div class="login-page">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="loginContainer"
      :rules="loginFormRules"
      v-loading="loading"
      element-loading-text="正在登录。。。"
    >
      <h3 class="loginTitle">登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text" clearable
          auto-complete="false"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          @keydown.enter.native="submitLogin('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password" clearable
          auto-complete="false"
          v-model="loginForm.password"
          placeholder="请输入密码"
          @keydown.enter.native="submitLogin('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" class="codecontainer">
        <el-input
          type="text" clearable
          class="loginCode"
          auto-complete="false"
          v-model="loginForm.code"
          placeholder="点击图片更换验证码"
          @keydown.enter.native="submitLogin('loginForm')"
        ></el-input>
        <img class="codeImg" :src="captchaUrl" @click="changeImg" />
      </el-form-item>
      <div class="opreation">
        <el-checkbox
          v-model="checked"
          class="loginRemenber"
          @keydown.enter.native="submitLogin('loginForm')"
          >记住我</el-checkbox
        >

      </div>

      <el-button
        type="primary"
        @click="submitLogin('loginForm')"
        style="width: 100%"
        >账号登录</el-button
      >
      <!-- <el-button type="success" style="width: 48.5%" @click="showDialog=true">第三方登录</el-button> -->
    </el-form>

    <!-- <el-dialog title="第三方登录" :visible.sync="showDialog">
      <social-signin></social-signin>
    </el-dialog> -->
  </div>
</template>

<script>
// import SocialSignin from './components/SocialSignin.vue'
export default {
  name: "Login",
  data() {
    return {
      showDialog: false,
      captchaUrl: "",
      loading: false,
      loginForm: {
        username: window.localStorage.getItem("username") || "",
        password: window.localStorage.getItem("password") || "",
        code: "",
      },
      checked: JSON.parse(window.localStorage.getItem("checked")) || false,
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLogin(loginForm) {
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.changeImg()
          this.postRequest("admin/Login/login",this.loginForm).then((res) => {
            if (res) {
              this.loading = false;
              if (res.code === 1) {
                // 将用户token存到sessionStorage
                const tokenStr = res.data.token;
                window.sessionStorage.setItem("tokenStr", tokenStr);
                const userinfo = res.data.userinfo;
                window.sessionStorage.setItem(
                  "userinfo",
                  JSON.stringify(userinfo)
                );

                if (this.checked) {
                  window.localStorage.setItem(
                    "username",
                    this.loginForm.username
                  );
                  window.localStorage.setItem(
                    "password",
                    this.loginForm.password
                  );
                  window.localStorage.setItem("checked", this.checked);
                } else {
                  window.localStorage.removeItem("username");
                  window.localStorage.removeItem("password");
                  window.localStorage.removeItem("checked");
                }

                // 页面跳转
                this.$router.replace("/controller");
              }
            } else {
              this.loading = false;
            }
          });
        } else {
          this.$message.error("请填写完整表单信息");
          return false;
        }
      });
    },
    changeImg() {
      this.captchaUrl = `http://api.sorting.com/admin/Login/verify?time=${Date.now()}`;
    }
  },
  created() {
    this.changeImg()
  },
  // components: {
  //   SocialSignin
  // }
};
</script>

<style scope>
.loginContainer {
  width: 350px;
  margin: 180px auto;
  padding: 15px 20px 25px;
  border-radius: 15px;
  background-clip: padding-box;
  border: 1px #c1b3b3 solid;
  background: #fff;
  box-shadow: 0 0 15px #bbbbbb;
}

.loginTitle {
  margin: 0 auto 20px auto;
  text-align: center;
}

.loginRemenber {
  margin-bottom: 20px;
}

.loginCode {
  width: 250px;
  margin-right: 5px;
}

.codecontainer {
  position: relative;
}

.codeImg {
  width: 95px;
  height: 40px;
  position: absolute;
}

.opreation {
  position: relative;
}
</style>
