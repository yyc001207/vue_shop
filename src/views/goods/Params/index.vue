<template>
  <div>
    <Breadcrumb breadcrumb1="商品管理" breadcrumb2="分类参数"></Breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col :span="2" class="cat_opt_span">
          <span>选择商品分类</span>
        </el-col>
        <el-col :span="8">
          <CateSelect
            :cateList="cateListType3"
            @cateIdList="cateIdList"
            :isParams="isParams"
          ></CateSelect>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <ParamsTabs :cateId="cateId"></ParamsTabs>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ParamsTabs from './ParamsTabs'
export default {
  name: 'Params',
  components: { ParamsTabs },
  data() {
    return {
      cateListType3: [], // 三级分类列表无分页
      isParams: true, // 向CateSelect告知我是Params组件
      cateId: 0, // 分类id
    }
  },
  computed: {
    ...mapState({
      cateList: (state) => state.goods.cateList,
    }),
  },
  mounted() {
    this.getCateList()
  },
  methods: {
    // 获取级联选择器数据
    getCateList() {
      this.$store.dispatch('getCateList', { type: 3 }).then(() => {
        this.cateListType3 = this.cateList
      })
    },
    // 级联选择器子组件返回的id
    cateIdList(idList) {
      if (idList.cat_level == 3) {
        this.cateId = idList.cat_pid
      } else {
        this.cateId = 0
      }
    },
  },
}
</script>

<style lang='less' scoped>
.cat_opt {
  margin: 15px 0;
  .cat_opt_span {
    margin-top: 10px;
  }
}
</style>