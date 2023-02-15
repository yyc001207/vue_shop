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
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
          <template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
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
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Users',
  data() {
    // 邮箱验证规则
    const checkEmail = (rules, value, callback) => {
      // 邮箱验证正则
      const regEmail = /^([A-z0-9_-])+@([A-z0-9_-])+(\.[A-z0-9_-])+/
      if (regEmail.test(value)) return callback()

      callback(new Error('请输入合法邮箱'))
    }
    // 手机号验证规则
    const checkMobile = (rules, value, callback) => {
      const regMobile = /^1[3-9]\d{9}$/
      if (regMobile.test(value)) return callback()

      callback(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '', // 搜索参数
        pagenum: 1, // 当前页数
        pagesize: 2, // 每页数据条数
      },
      total: 0, // 数据总条数
      addDialogVisible: false, // 控制添加用户对话框显示隐藏
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      }, // 添加用户的数据
      // 添加表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3至10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6至15个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
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
    // 关闭弹出框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击弹出框确定按钮，添加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        this.$store
          .dispatch('addUser', this.addForm)
          .then(() => {
            this.$message.success('添加用户成功')
            this.addDialogVisible = false
            this.getUserList()
          })
          .catch(() => {
            this.$message.error('添加失败')
          })
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>