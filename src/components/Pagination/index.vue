<template>
  <div>
    <el-pagination
      :page-sizes="[3, 5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="pagenum"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['total', 'pagenum', 'pagesize'],
  methods: {
    // 监听pagesize改变
    handleSizeChange(newSize) {
      let isSize = true
      this.$emit('pageChange', newSize, isSize)
    },
    // 监听 页码值改变
    handleCurrentChange(newPage) {
      this.$emit('pageChange', newPage)
    },
  },
}
</script>