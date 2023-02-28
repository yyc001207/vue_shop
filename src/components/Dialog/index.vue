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
      <div slot="title" v-else-if="isRoles">
        <span v-if="showDialog == 1">{{ '添加角色' }}</span>
        <span v-else>{{ '修改角色' }}</span>
      </div>
      <div slot="title" v-else>
        <span v-if="showDialog == 1">{{ '添加分类' }}</span>
        <span v-else>{{ '修改分类' }}</span>
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
        <div v-else-if="isRoles">
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
        <!-- 分类 -->
        <div v-else>
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name">{{
              addForm.cat_name
            }}</el-input>
          </el-form-item>
          <el-form-item label="父级分类" v-if="showDialog == 1">
            <el-cascader
              clearable
              filterable
              v-model="selectedKeys"
              :options="cateListType2"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: 'true',
              }"
              @change="handleChange"
            ></el-cascader>
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
import { userAddFormRulesMixin } from '@/mixin/formValidation'
export default {
  name: 'Dialog',
  mixins: [userAddFormRulesMixin], // mixin混入添加表单验证规则
  data() {
    return {
      addForm: {
        // 用户
        username: '',
        password: '',
        email: '',
        mobile: '',
        // 角色
        roleName: '',
        roleDesc: '',
        // 分类
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      }, // 添加用户的数据
      dialogVisible: false,
      fullscreenLoading: false,
      selectedKeys: [], // 选择框数组
    }
  },
  computed: {
    ...mapState({
      userById: (state) => state.user.userById,
      roleById: (state) => state.authority.roleById,
      catNameById: (state) => state.goods.catNameById,
      cateListType2: (state) => state.goods.cateListType2,
    }),
  },
  props: ['showDialog', 'id', 'isUser', 'isRoles', 'isCate'],
  watch: {
    showDialog() {
      if (this.showDialog != 0) {
        this.dialogVisible = true
        if (this.showDialog == 1 && this.isCate) {
          this.$store.dispatch('getCateListType2', { type: 2 })
        }
      }
    },
    id() {
      if (this.id) {
        this.fullscreenLoading = true
        if (this.isUser) {
          this.$store.dispatch('getUserById', this.id)
        } else if (this.isRoles) {
          this.$store.dispatch('getRoleById', this.id)
        } else {
          this.$store.dispatch('getCatNameById', this.id)
        }
      }
    },
    userById() {
      this.addFormAssignment(this.userById)
    },
    roleById() {
      this.addFormAssignment(this.roleById)
    },
    catNameById() {
      this.addFormAssignment(this.catNameById)
    },
  },
  methods: {
    // 关闭弹出框
    dialogClosed() {
      this.$emit('dialogClosed')
      this.$refs.addFormRef.resetFields()
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
      this.selectedKeys = []
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
      const { mobile, email, roleName, roleDesc, cat_name } = this.addForm
      const { id } = this
      if (this.isUser) {
        this.determine('addUser', 'editUser', { id, mobile, email })
      } else if (this.isRoles) {
        this.determine('addRole', 'editRole', { id, roleName, roleDesc })
      } else {
        this.determine('addCate', 'editCatName', { id, cat_name })
      }
    },
    // addform表单赋值
    addFormAssignment(obj) {
      Object.keys(this.addForm).forEach((key) => (this.addForm[key] = obj[key]))
      this.fullscreenLoading = false
    },
    // 选择框发生变化
    handleChange() {
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
  },
}
</script>

<style lang='less' scoped>
.el-cascader-panel {
  width: 100%;
}
</style>