<template>
  <div>
    <el-dialog
      :title="titleText + tableLabel"
      :visible.sync="dialogVisible"
      @close="dialogClosed"
    >
      <el-form
        :model="form"
        :rules="formRules"
        label-width="100px"
        ref="formRef"
      >
        <el-form-item :label="tableLabel" prop="attr_name">
          <el-input v-model="form.attr_name">{{ form.attr_name }} </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAndEdit">确 定</el-button>
      </span></el-dialog
    >
  </div>
</template>

<script>
import { paramsFormRules } from '@/mixin/formValidation'
export default {
  name: 'ParamsDialog',
  props: [
    'tableLabel',// 动态编辑提示
    'showDialog',// 控制用户对话框显示隐藏，0隐藏，1添加，2修改
    'activeName',
    'cateId',
    'attrName',
    'attrId',
  ],
  mixins: [paramsFormRules], // mixin混入添加表单验证
  data() {
    return {
      dialogVisible: false, // 弹出框隐藏与消失
      // 收集表单数据
      form: {
        attr_name: '', // 收集参数名称
      },
    }
  },
  watch: {
    // 当父组件传递的showDialog为1或2时，显示弹出框
    showDialog() {
      if (this.showDialog) {
        this.dialogVisible = true
      }
    },
    // 保存父组件传递的参数名称
    attrName() {
      this.form.attr_name = this.attrName
    },
  },
  computed: {
    // 动态编辑弹出框提示
    titleText() {
      switch (this.showDialog) {
        case 1:
          return '添加'
        case 2:
          return '修改'
        default:
          return ''
      }
    },
  },
  methods: {
    // 关闭弹出框回调函数
    dialogClosed() {
      // 清空表单
      this.$refs.formRef.resetFields()
      // 通知父组件弹出框关闭
      this.$emit('dialogClosed')
    },
    // 添加或修改参数的方法
    determine(fn, data) {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return
        this.$store
          .dispatch(fn, data)
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
      if (this.showDialog == 1) {
        this.determine('addParams', {
          attr_name: this.form.attr_name,
          attr_sel: this.activeName,
          id: this.cateId,
        })
      } else {
        this.determine('editParams', {
          attr_name: this.form.attr_name,
          attr_sel: this.activeName,
          id: this.cateId,
          attrId: this.attrId,
        })
      }
    },
  },
}
</script>

<style>
</style>