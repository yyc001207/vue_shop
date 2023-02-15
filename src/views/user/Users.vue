<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog = 1">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList.users" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <UserDialog
      :showDialog="showDialog"
      @userDialogClosed="userDialogClosed"
      :id="id"
    ></UserDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Users',
  data() {
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '', // 搜索参数
        pagenum: 1, // 当前页数
        pagesize: 2, // 每页数据条数
      },
      total: 0, // 数据总条数
      showDialog: 0, // 控制用户对话框显示隐藏，0隐藏，1添加，2修改
      id: '',
    }
  },
  computed: {
    ...mapState({
      userList: (state) => state.user.userList,
    }),
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.$store.dispatch('getUserList', this.queryInfo).then(() => {
        this.total = this.userList.total
      })
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关状态
    userStateChanged(userinfo) {
      const { id, mg_state } = userinfo
      this.$store
        .dispatch('userStateChanged', { id, mg_state })
        .then(() => {
          this.$message.success('修改成功')
        })
        .catch(() => {
          this.$message.error('修改失败')
          userinfo.mg_state = !mg_state
        })
    },
    // 关闭对话框
    userDialogClosed() {
      this.id = ''
      this.showDialog = 0
      this.getUserList()
    },
    // 点击修改按钮
    editDialog(value) {
      this.showDialog = 2
      this.id = value
    },
    // 删除用户
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store
            .dispatch('removeUserById', id)
            .then(() => {
              this.$message.info('删除成功')
              this.getUserList()
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
  },
}
</script>

<style lang="less" scoped>
</style>