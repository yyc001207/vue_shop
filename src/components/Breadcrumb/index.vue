<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ breadcrumb1 }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ breadcrumb2 }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: ['breadcrumb1', 'breadcrumb2'],
}
</script>