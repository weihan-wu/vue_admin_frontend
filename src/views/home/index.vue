<template>
  <div>
    <el-container
      ><Menu></Menu>
      <el-container>
        <el-header class="home-header">
          <Header></Header>
        </el-header>
        <el-main>
          <el-breadcrumb class="crumb" separator-class="el-icon-arrow-right"
                         v-if="this.$router.currentRoute.path !== '/controller'">
            <el-breadcrumb-item :to="{ path: '/controller' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-divider v-if="this.$router.currentRoute.path !== '/controller'"></el-divider>
          <keep-alive>
            <router-view exclude="编辑公告"></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Menu from "../../components/menu/index.vue";
import Header from "../../components/header/index.vue";
export default {
  name: "Home",
  components: {
    Menu,
    Header,
  },
};
</script>

<style>
.home-header {
  background: #2f0b8e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
  width: 100%;
}
</style>