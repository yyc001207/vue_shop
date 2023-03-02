<template>
  <div>
    <el-cascader
      clearable
      filterable
      v-model="selectedKeys"
      :options="cateList"
      :props="{
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: !isParams,
      }"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'CateSelect',
  props: ['cateList', 'isParams'],
  data() {
    return {
      selectedKeys: [], // 选择框数组
      cat: {
        cat_pid: 0,
        cat_level: 0,
      },
    }
  },
  methods: {
    handleChange() {
      if (this.selectedKeys.length > 0) {
        if (this.isParams && this.selectedKeys.length != 3) {
          this.selectedKeys = []
          this.$message.warning('无法给非三级分类添加参数或属性')
        }
        this.cat.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.cat.cat_level = this.selectedKeys.length
      } else {
        this.cat.cat_pid = 0
        this.cat.cat_level = 0
      }
      this.$emit('cateIdList', this.cat)
    },
  },
}
</script>

<style scoped lang='less'>
.Confirm-selection {
  margin-left: 10px;
}
</style>