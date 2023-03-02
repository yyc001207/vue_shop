<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb breadcrumb1="商品管理" breadcrumb2="商品分类"></Breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="showDialog = 1"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区 -->
      <el-table
        :data="cateListPage.result"
        border
        row-key="cat_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column label="序号" prop="index"> </el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="updateCatName(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeCateById(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <Pagination
        :total="total"
        :pagesize="queryInfo.pagesize"
        :pagenum="queryInfo.pagenum"
        @pageChange="pageChange"
      ></Pagination>
    </el-card>
    <Dialog
      :showDialog="showDialog"
      @dialogClosed="dialogClosed"
      :id="id"
      :isCate="isCate"
    ></Dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Categories',
  data() {
    return {
      // 分类列表获取条件
      queryInfo: {
        type: 3, // 获取多少级分类，1，2，3
        pagenum: 1, // 当前页
        pagesize: 3, // 每页数据条数
      },
      total: 0, // 数据总条数
      showDialog: 0,// 控制用户对话框显示隐藏，0隐藏，1添加，2修改
      id: '',
      isCate: true,
      cateListPage: {}, // 具有分页的分类列表
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
    getCateList() {
      this.$store.dispatch('getCateList', this.queryInfo).then(() => {
        this.total = this.cateList.total
        this.cateListPage = this.cateList
      })
    },
    // 分页器
    pageChange(data, isSize) {
      isSize
        ? (this.queryInfo.pagesize = data)
        : (this.queryInfo.pagenum = data)
      this.getCateList()
    },
    // 根据id删除商品分类
    removeCateById(cateId) {
      this.$remove('removeCateById', cateId).then(() => {
        if (this.cateListPage.result.length == 1) {
          this.queryInfo.pagenum -= 1
        }
        this.getCateList()
      })
    },
    // 修改分类按钮
    updateCatName(id) {
      this.id = id
      this.showDialog = 2
    },
    // 弹出框关闭，初始化数据，重新请求数据
    dialogClosed() {
      this.id = ''
      this.showDialog = 0
      this.getCateList()
    },
  },
}
</script>

<style>
</style>