<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb breadcrumb1="权限管理" breadcrumb2="权限列表"></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="authorityList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AuthorityList',
  computed: {
    ...mapState({
      authorityList: (state) => state.authority.authorityList,
    }),
  },
  mounted() {
    this.getAuthorityList()
  },
  methods: {
    // 获取权限列表
    getAuthorityList() {
      this.$store.dispatch('getAuthorityList')
    },
  },
}
</script>

<style lang="less" scoped>
</style>