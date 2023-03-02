<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <ParamsTable
          v-loading="loading"
          :paramsData="paramsData"
          :activeName="activeName"
          @resultByChange="resultByChange"
          :cateId="cateId"
        ></ParamsTable>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <ParamsTable
          v-loading="loading"
          :paramsData="paramsData"
          :activeName="activeName"
          @resultByChange="resultByChange"
          :cateId="cateId"
        ></ParamsTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ParamsTable from './ParamsTable'
export default {
  name: 'ParamsTabs',
  components: { ParamsTable },
  props: ['cateId'],
  data() {
    return {
      activeName: 'many',
      loading: false,
    }
  },
  computed: {
    ...mapState({
      paramsData: (state) => state.goods.paramsData,
    }),
  },
  watch: {
    cateId() {
      this.getParamsData()
    },
  },
  methods: {
    // 获取参数列表
    getParamsData() {
      this.loading = true
      this.$store
        .dispatch('getParamsList', {
          id: this.cateId,
          sel: this.activeName,
        })
        .then(() => {
          this.loading = false
        })
    },
    // 切换标签页
    handleClick() {
      this.getParamsData()
    },
    // 子组件ParamsTable完成变更参数列表操作后，重新获取参数列表数据
    resultByChange() {
      this.getParamsData()
    },
  },
}
</script>

<style>
</style>