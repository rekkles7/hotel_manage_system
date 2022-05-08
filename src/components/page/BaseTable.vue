<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
            type="primary"
            icon="el-icon-delete"
            class="handle-del mr10"
            @click="updateOperation('delete')"
        >批量删除
        </el-button>
        <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="success" icon="el-icon-plus" @click="updateOperation('post')">新增</el-button>
        <el-button type="danger" icon="el-icon-edit" @click="updateOperation('put')">修改</el-button>
        <el-button type="warning" icon="el-icon-download" @click="resetPassword">重置密码</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <el-table-column prop="gender" label="性别"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <!--                <el-table-column prop="createTime" label="创建日期"></el-table-column>-->
        <!--                <el-table-column label="账户余额">-->
        <!--                    <template slot-scope="scope">￥{{scope.row.money}}</template>-->
        <!--                </el-table-column>-->
        <!--                <el-table-column label="头像" align="center">-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <el-image-->
        <!--                            class="table-td-thumb"-->
        <!--                            :src="scope.row.thumb"-->
        <!--                            :preview-src-list="[scope.row.thumb]"-->
        <!--                        ></el-image>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <!--                <el-table-column prop="address" label="地址"></el-table-column>-->
        <!--                <el-table-column label="状态" align="center">-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <el-tag-->
        <!--                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"-->
        <!--                        >{{scope.row.state}}</el-tag>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->

        <!--                <el-table-column prop="date" label="注册时间"></el-table-column>-->
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click=""
            >编辑
            </el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog append-to-body title="用户信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="66px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender" style="width: 178px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
              v-model="roleDatas"
              placeholder="请选择角色"
              @change="changeRole"
          >
            <el-option
                v-for="item in roles"
                :key="item.name"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="酒店" prop="hotel">
          <el-select
              v-model="hotelDatas"
              placeholder="请选择酒店"
              @change="changeHotel"
          >
            <el-option
                v-for="item in hotels"
                :key="item.hotelName"
                :label="item.hotelName"
                :value="item.hotelId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from 'element-ui'
import store from "@/store"

export default {
  name: 'basetable',
  data() {
    return {
      query: {
        username: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      dialogFormVisible: false,
      pageTotal: 0,
      idx: -1,
      id: -1,
      roles: [],
      hotels: [],
      selectData: [],
      roleDatas: [],
      hotelDatas: '',
      form: {
        //以下是示例数据，可以删除
        username: 'testJeff520',
        email: '786500545@qq.com',
        nickName: 'houky',
        id: null,
        phone: 13242842112,
        roles: [{id: 2}],
        hotelId: '',
        enabled: true,
        gender: '男',
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    resetUser(data) {
      this.$request({url: 'api/users/resetPassword',method: 'delete',data: data}).then(res => {
        Element.Message.success("操作成功")
        this.getUserInfo()
      })
    },
    updateUser(data) {
      let op = this.$store.state.operation
      console.log("提交给后端/api/users接口的数据", data)
      console.log(op)
      this.$request({url: 'api/users', method: op, data: data}).then(res => {
        console.log(op + '用户成功')
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getUserInfo()
      })
    },
    changeRole() {
      this.form.roles = this.roleDatas.map(value => {
        return {id: value}
      })
    },
    changeHotel() {
      this.form.hotelId = this.hotelDatas
    },
    getHotel(){
      this.$request.get('user/hotel/selectAllHotel').then(res => {
        this.hotels = res.data.data
      })
    },
    getRole() {
      this.$request.get('api/roles/all').then(res => {
        this.roles = res.data
      })
    },
    mapForm(selectRow) {
      console.log(selectRow)
      this.roleDatas = selectRow.roles.map(value => value.name)
      this.hotelDatas = selectRow.hotelId
      this.form = selectRow
    },
    resetPassword() {
      this.$confirm('确定要重置密码吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            this.resetUser(this.selectData.map(value => value.id))
            this.$message.success('重置成功');
          })
          .catch(() => {
          });
    },
    updateOperation(op) {
      if (op === 'put') this.mapForm(this.selectData[0])
      this.$store.commit('SET_OP', op)
      this.dialogFormVisible = op !== 'delete'
      if (op !== 'delete'){
        this.getRole();
        this.getHotel();
      }
      else {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
            .then(() => {
              this.updateUser(this.selectData.map(value => value.id))
              this.$message.success('删除成功');
            })
            .catch(() => {
            });
      }
    },
    getUserInfo() {
      this.$request.get('api/users/selectUser',{
        params:{
          userName: this.query.username,
          pageSize: this.query.pageSize,
          pageIndex: this.query.pageIndex
        }
      }).then(res => {
        this.tableData = res.data.userList.content
        this.pageTotal = res.data.length || 50
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, 'pageIndex', 1);
      this.getUserInfo();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            this.$message.success('删除成功');
            this.tableData.splice(index, 1);
          })
          .catch(() => {
          });
    },
    // 多选操作
    handleSelectionChange(rows) {
      this.selectData = rows
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = '';
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.form = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageIndex', val);
      this.getUserInfo();
    },
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #ff0000;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
