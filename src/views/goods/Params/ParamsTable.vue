<template>
  <div>
    <el-button type="primary" @click="showDialog = 1" :disabled="!cateId"
      >添加{{ tableLabel }}</el-button
    >
    <el-table :data="paramsData" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tag
            v-for="(item, index) in scope.row.attr_vals"
            :key="index"
            closable
            @close="handleClose(index, scope.row)"
            >{{ item }}</el-tag
          >
          <el-input
            class="input-new-tag newTag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag newTag"
            size="small"
            @click="showInput(scope.row)"
            >+ New Tag</el-button
          >
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column :label="tableLabel" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editParams(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeParams(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <ParamsDialog
      :tableLabel="tableLabel"
      :showDialog="showDialog"
      @dialogClosed="dialogClosed"
      :activeName="activeName"
      :cateId="cateId"
      :attrName="attr_name"
      :attrId="attr_id"
    ></ParamsDialog>
  </div>
</template>

<script>
import ParamsDialog from './ParamsDialog'
export default {
  name: 'ParamsTable',
  components: { ParamsDialog },
  props: ['paramsData', 'activeName', 'cateId'],
  data() {
    return {
      showDialog: 0, // 控制用户对话框显示隐藏，0隐藏，1添加，2修改
      attr_id: 0, // 参数id
      attr_name: '', // 参数名称
    }
  },
  computed: {
    // 计算动态的表格表头
    tableLabel() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
  methods: {
    // 子组件ParamsDialog的弹出框关闭时
    dialogClosed() {
      this.showDialog = 0
      this.attr_id = 0
      this.attr_name = ''
      // 告知父组件完成了一次数据交互
      this.$emit('resultByChange')
    },
    // 根据id删除参数
    removeParams(obj) {
      const { cat_id, attr_id } = obj
      this.$remove('removeParams', { cat_id, attr_id }).then(() => {
        this.$emit('resultByChange')
      })
    },
    // 修改参数
    editParams(data) {
      this.attr_id = data.attr_id
      this.attr_name = data.attr_name
      this.showDialog = 2
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // tag文本框失去焦点或敲击回车键
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      this.saveAttrVals(row)
    },
    // 删除tag标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    saveAttrVals(row) {
      this.$store.dispatch('editParams', {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
        id: this.cateId,
        attrId: row.attr_id,
      })
    },
  },
}
</script>

<style scoped lang='less'>
.el-tag {
  margin: 0 5px;
}
.newTag {
  margin: 0 5px;
  width: 120px;
}
</style>