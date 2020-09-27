<template>
  <div class="app-container">

    <el-form :inline="true" :model="formSearch" class="demo-form-inline">
      <el-form-item width="200">
        <el-input v-model="formSearch.t" placeholder="Username/Email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="formSearch.roles">
          <el-checkbox label="admin" name="roles">Admin</el-checkbox>
          <el-checkbox label="editor" name="roles">Editor</el-checkbox>
          <el-checkbox label="customer" name="roles">Customer</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column width="70">
        <template slot-scope="scope">
          <router-link :to="'edit/' + scope.row._id">
            <el-avatar size="medium" fit="scale-down" :src="thumb_base + scope.row.avatar" />
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Username">
        <template slot-scope="scope">
          <router-link :to="'edit/' + scope.row._id">
            {{ scope.row.username }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Enabled">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled" disabled />
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Roles" align="center">
        <template slot-scope="scope">
          {{ scope.row.roles.join(', ') }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      v-if="pagination.total > pagination.page_size"
      :total="pagination.total"
      :page-size="pagination.page_size"
      @current-change="changePage"
      >
    </el-pagination>
  </div>
</template>

<script>
//import { getList } from '@/api/user'
import { usersAPI } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      // query: {},
      pagination: {
        total: 0,
        page_size: 30,
      },
      page: 1,
      formSearch: {
        t: '',
        roles: [],
      },
      thumb_base: process.env.VUE_APP_BASE_API + '/',
    }
  },
  computed: {
    query: {

      get: function () {
        var rez = {
          pg: this.page,
          page_size: this.pagination.page_size
        }
        var fs = this.formSearch
        if (fs.t) rez.t = fs.t
        if (fs.roles) rez.roles = fs.roles.join(',')
        return rez
      },
      set: function(value) {
        console.log(value)
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      var vm = this
      usersAPI.getList(this.query).then(response => {
        vm.list = response.data.items
        vm.pagination = response.data.pagination
        vm.listLoading = false
      })
    },
    changePage(pgNr) {
      this.page = pgNr
      this.fetchData()
    },
    onSearch(){
      var q = {}
      var formSearch = this.formSearch
      if (formSearch.username) q.username = formSearch.username
      if (formSearch.email) q.email = formSearch.email
      if (formSearch.roles) q.roles = formSearch.roles
      this.query = q
      this.fetchData();
    }
  }
}
</script>
