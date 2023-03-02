<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb breadcrumb1="权限管理" breadcrumb2="角色列表"></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showDialog = 1">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 角色权限展开列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expand">
              <el-row
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
                :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              >
                <!-- 一级 -->
                <el-col :span="5">
                  <el-tag
                    closable
                    @close="removeRightById(scope.row, item1.id)"
                  >
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                    :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  >
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightById(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18">
                      <el-tag
                        closable
                        @close="removeRightById(scope.row, item3.id)"
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-tools"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加修改角色对话框 -->
    <Dialog
      :showDialog="showDialog"
      @dialogClosed="dialogClosed"
      :id="id"
      :isRoles="isRoles"
    ></Dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
      v-loading.lock="fullscreenLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="authorityTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        ref="treeRef"
        :default-expanded-keys="defKeys"
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import remove from '@/utils/remove'
import { mapState } from 'vuex'
export default {
  name: 'Roles',
  data() {
    return {
      setRightDialogVisible: false,
      showDialog: 0, // 控制对话框显示隐藏，0隐藏，1添加，2修改
      id: '',
      isRoles: true,
      // 属性控件
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的树形节点id值
      defKeys: [],
      fullscreenLoading: false,
      roleId: '',
    }
  },
  computed: {
    ...mapState({
      rolesList: (state) => state.authority.rolesList,
      rightById: (state) => state.authority.rightById,
      authorityTree: (state) => state.authority.authorityTree,
    }),
  },
  mounted() {
    this.getRolesList()
  },
  watch: {
    rightById() {},
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      this.$store.dispatch('getRolesList')
    },
    // 对话框隐藏
    dialogClosed() {
      this.id = ''
      this.showDialog = 0
      this.getRolesList()
    },
    // 点击修改按钮
    editDialog(value) {
      this.showDialog = 2
      this.id = value
    },
    // 根据id删除角色
    removeRoleById(id) {
      this.$remove('removeRoleById', id).then(() => {
        this.getRolesList()
      })
    },
    // 根据id删除权限
    removeRightById(role, rightId) {
      let roleId = (this.roleId = role.id)
      this.$remove('removeRightById', { roleId, rightId }).then(() => {
        this.rolesList.forEach((item) => {
          if ((item.id = this.roleId)) {
            item.children = this.rightById
          }
        })
      })
    },
    // 点击分配权限按钮
    showSetRightDialog(role) {
      this.roleId = role.id
      this.fullscreenLoading = true
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      // 获取所有权限数据（树）
      this.$store.dispatch('getAuthorityTree').then(() => {
        this.fullscreenLoading = false
      })
    },
    // 递归获取角色下所有三级权限id
    getLeafKeys(node, arr) {
      // 如果当前节点没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 分配权限对话框关闭事件
    setRightDialogClose() {
      this.defKeys = []
    },
    // 对话框确定按钮
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { roleId } = this
      this.$store
        .dispatch('updateRight', { roleId, idStr })
        .then(() => {
          this.setRightDialogVisible = false
          this.$message.success('权限分配成功')
          this.getRolesList()
        })
        .catch(() => {
          this.$message.error('权限分配失败')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.expand {
  margin-left: 50px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>