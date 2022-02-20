<template>
  <div class="header-container">
    <div class="title">垃圾分类助手管理系统</div>
    <el-dropdown class="userinfo" @command="userCommand">
      <span class="el-dropdown-link">
        {{user.admin_username}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="resetPassword">重置密码</el-dropdown-item>
        <el-dropdown-item command="logout">注销登陆</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>

</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        user: JSON.parse(window.sessionStorage.getItem('userinfo'))
      }
    },
    methods:{
      userCommand(command) {
        if (command === 'logout') {
          this.$confirm('是否注销登录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.sessionStorage.removeItem('tokenStr')
            window.sessionStorage.removeItem('userinfo')
            this.$router.replace('/login')
            this.$store.commit('clearRoutes')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '注销操作已取消'
            });
          });

        } else if(command === 'resetPassword') {
          console.log('resetPassword')
        }
      }
    }
  }
</script>

<style lang="less">
.header-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  .title {
    color: white;
    font-size: 20px;
    font-family: 华文楷体,serif;
    pointer-events: none;
  }

  .userinfo {
    cursor: pointer;
    color: white;
    opacity: 0.8;
    transition: all 0.5s;
  }

  .userinfo:hover {
    opacity: 1;
  }
}

</style>
