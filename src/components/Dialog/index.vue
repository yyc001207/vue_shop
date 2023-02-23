<template>
  <div>
    <!-- 对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
      v-loading.lock="fullscreenLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div slot="title" v-if="isUser">
        <span v-if="showDialog == 1">{{ '添加用户' }}</span>
        <span v-else>{{ '修改用户' }}</span>
      </div>
      <div slot="title" v-else>
        <span v-if="showDialog == 1">{{ '添加角色' }}</span>
        <span v-else>{{ '修改角色' }}</span>
      </div>
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <!-- 用户 -->
        <div v-if="isUser">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" :disabled="showDialog == 2">{{
              addForm.username
            }}</el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="showDialog == 1">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" clearable>{{
              addForm.email
            }}</el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile" clearable>{{
              addForm.mobile
            }}</el-input>
          </el-form-item>
        </div>
        <!-- 角色 -->
        <div v-else>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName">{{
              addForm.roleName
            }}</el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc">{{
              addForm.roleDesc
            }}</el-input>
          </el-form-item>
        </div>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAndEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Dialog',
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
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
        roleName: '',
        roleDesc: '',
      }, // 添加用户的数据
      dialogVisible: false,
      fullscreenLoading: false,
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
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在3至10个字符', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapState({
      userById: (state) => state.user.userById,
      roleById: (state) => state.authority.roleById,
    }),
  },
  props: ['showDialog', 'id', 'isUser', 'isRoles'],
  watch: {
    showDialog() {
      if (this.showDialog != 0) {
        this.dialogVisible = true
      }
    },
    id() {
      if (this.id) {
        this.fullscreenLoading = true
        if (this.isUser) {
          this.$store.dispatch('getUserById', this.id)
        } else {
          this.$store.dispatch('getRoleById', this.id)
        }
      }
    },
    userById() {
      this.addFormAssignment(this.userById)
      this.fullscreenLoading = false
    },
    roleById() {
      this.addFormAssignment(this.roleById)
      this.fullscreenLoading = false
    },
  },
  methods: {
    // 关闭弹出框
    dialogClosed() {
      this.$emit('dialogClosed')
      this.$refs.addFormRef.resetFields()
    },
    determine(add, edit, data) {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        ;(this.showDialog == 1
          ? this.$store.dispatch(add, this.addForm)
          : this.$store.dispatch(edit, data)
        )
          .then(() => {
            this.$message({
              message: `${this.showDialog == 1 ? '添加成功' : '修改成功'}`,
              type: 'success',
            })
            this.dialogVisible = false
          })
          .catch(() => {
            this.$message({
              message: `${this.showDialog == 1 ? '添加失败' : '修改失败'}`,
              type: 'error',
            })
            this.dialogVisible = false
          })
      })
    },
    // 点击弹出框确定按钮
    addAndEdit() {
      const { mobile, email, roleName, roleDesc } = this.addForm
      const { id } = this
      if (this.isUser) {
        this.determine('addUser', 'editUser', { id, mobile, email })
      } else {
        this.determine('addRole', 'editRole', { id, roleName, roleDesc })
      }
    },
    // addform表单赋值
    addFormAssignment(obj) {
      Object.keys(this.addForm).forEach((key) => (this.addForm[key] = obj[key]))
    },
  },
}
</script>

<style>
</style>