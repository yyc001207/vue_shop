<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb breadcrumb1="用户管理" breadcrumb2="用户列表"></Breadcrumb>
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
        <el-table-column label="操作" width="300px">
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
                @click="setRole(scope.row)"
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
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <Dialog
      :showDialog="showDialog"
      @dialogClosed="dialogClosed"
      :id="id"
      :isUser="isUser"
    ></Dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
      v-loading.lock="fullscreenLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div>
        <p>当前用户:{{ userInfo.username }}</p>
        <p>当前角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  name: 'Users',
  data() {
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '', // 搜索参数
        pagenum: 1, // 当前页数
        pagesize: 3, // 每页数据条数
      },
      total: 0, // 数据总条数
      showDialog: 0, // 控制用户对话框显示隐藏，0隐藏，1添加，2修改
      // 被修改用户的id
      id: '',
      // 通知子组件我是Users组件
      isUser: true,
      // 分配角色弹框
      setRoleDialogVisible: false,
      // 需要分配权限的角色信息
      userInfo: {},
      fullscreenLoading: false,
      selectedRoleId: '',
    }
  },
  computed: {
    ...mapState({
      userList: (state) => state.user.userList,
      rolesList: (state) => state.authority.rolesList,
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
    // 开关防抖
    changed: debounce(function (userinfo) {
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
    }, 1000),
    // 监听switch开关状态
    userStateChanged(userinfo) {
      this.changed(userinfo)
    },
    // 关闭对话框
    dialogClosed() {
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
    // 展示分配角色按钮
    setRole(userInfo) {
      this.fullscreenLoading = true
      this.userInfo = userInfo
      this.$store
        .dispatch('getRolesList')
        .then(() => {
          this.fullscreenLoading = false
          this.setRoleDialogVisible = true
        })
        .catch(() => {
          this.$message.error('获取角色列表失败')
        })
    },
    // 点击弹出框确定按钮,保存角色修改
    saveRoleInfo() {
      this.$store
        .dispatch('saveRoleInfo', {
          id: this.userInfo.id,
          rid: this.selectedRoleId,
        })
        .then(() => {
          this.$message.success('分配成功')
          this.setRoleDialogVisible = false
          this.getUserList()
        })
        .catch(() => {
          this.$message.error('分配失败')
        })
    },
    // 关闭对话框，重置数据
    setRoleDialogClose() {
      this.selectedRoleId = ''
      this.userInfo = {}
    },
  },
}
</script>

<style lang="less" scoped>
</style>