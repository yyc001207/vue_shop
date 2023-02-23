<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="@/assets/aaa.jpg" />
        <span>电商后台管理</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠展开菜单-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <i :class="menuIcon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              @click="saveNavState('/' + subItem.path)"
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Home',
  data() {
    return {
      isCollapse: false, // 是否展开菜单控制
      activePath: '', // 激活菜单控制
    }
  },
  computed: {
    ...mapState({
      menuList: (state) => state.authority.menuList,
    }),
    menuIcon() {
      return {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      }
    },
  },
  mounted() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      })
    },
    getMenuList() {
      // 获取左侧菜单
      this.$store.dispatch('getMenuList')
    },
    // 点击折叠展开菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存菜单激活状态，使用sessionStorage保存当前位置
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    },
  
  },
  
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;

  .el-header {
    background-color: #37314d;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    transition: 0.5s;
    .toggle-button {
      background-color: #4a5064;
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.iconfont {
  margin-right: 10px;
}
</style>