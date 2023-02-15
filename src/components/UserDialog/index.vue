<template>
  <div>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <div slot="title">
        <span v-if="showDialog == 1">{{ '添加用户' }}</span>
        <span v-else>{{ '修改用户' }}</span>
      </div>
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
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
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="user">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'UserDialog',
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
      }, // 添加用户的数据
      dialogVisible: false,
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
      userById: (state) => state.user.userById,
    }),
  },
  props: ['showDialog', 'id'],
  watch: {
    showDialog() {
      if (this.showDialog != 0) {
        this.dialogVisible = true
      }
    },
    id() {
      if (this.id) {
        this.$store.dispatch('getUserById', this.id)
      }
    },
    userById() {
      this.addForm.username = this.userById.username
      this.addForm.mobile = this.userById.mobile
      this.addForm.email = this.userById.email
    },
  },

  methods: {
    // 关闭弹出框
    dialogClosed() {
      this.$emit('userDialogClosed')
      this.$refs.addFormRef.resetFields()
    },
    // 点击弹出框确定按钮，添加修改用户
    user() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        const { mobile, email } = this.addForm
        const { id } = this
        ;(this.showDialog == 1
          ? this.$store.dispatch('addUser', this.addForm)
          : this.$store.dispatch('editUser', { id, mobile, email })
        )
          .then(() => {
            this.$message({
              message: `${
                this.showDialog == 1 ? '添加用户成功' : '修改用户成功'
              }`,
              type: 'success',
            })
            this.dialogVisible = false
          })
          .catch(() => {
            this.$message({
              message: `${this.showDialog == 1 ? '添加失败' : '修改失败'}`,
              type: 'error',
            })
          })
      })
    },
  },
}
</script>

<style>
</style>