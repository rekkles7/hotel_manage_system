<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-file"></i> 订单管理
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
        >批量删除</el-button>
        <el-input v-model="query.name" placeholder="订单信息" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="danger" icon="el-icon-edit" @click="updateOperation('put')">修改</el-button>
        <el-button type="warning" icon="el-icon-download" @click="">导出</el-button>
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
        <el-table-column
            fixed
            v-if="show"
            prop="orderId"
            label="订单编号"
            width="150">
        </el-table-column>
        <el-table-column prop="orderUserName" label="预留姓名"></el-table-column>
        <el-table-column prop="orderUserTelephone" label="预留电话"></el-table-column>
        <el-table-column prop="startOfDate" label="入住日期"></el-table-column>
        <el-table-column prop="endOfDate" label="离店日期"></el-table-column>
        <el-table-column prop="orderPrice" label="订单价格"></el-table-column>
        <el-table-column prop="orderUserPs" label="备注"></el-table-column>
        <el-table-column prop="roomName" label="房型名称"></el-table-column>
        <el-table-column prop="orderRoomNumber" label="房型数量"></el-table-column>
<!--        <el-table-column prop="orderStatus" label="订单状态"></el-table-column>-->
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.orderStatus === 0" type="danger">待支付</el-tag>
            <el-tag v-else-if="scope.row.orderStatus === 1" type="warning">待确认</el-tag>
            <el-tag v-else-if="scope.row.orderStatus === 2" type="info">待入住</el-tag>
            <el-tag v-else-if="scope.row.orderStatus === 3" type="success">已入住</el-tag>
            <el-tag v-else>已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click=""
            >编辑</el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                class="red"
                @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
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
    <el-dialog append-to-body title="订单信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="80px">
        <el-form-item label="订单id" v-if="show">
          <el-input v-model="form.orderId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预留姓名">
          <el-input v-model="form.orderUserName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="预留电话">
          <el-input v-model="form.orderUserTelephone" autocomplete="off" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="form.orderStatus" placeholder="请选择">
            <el-option label="待支付" value="0"></el-option>
            <el-option label="待确认" value="1"></el-option>
            <el-option label="待入住" value="2"></el-option>
            <el-option label="已入住" value="3"></el-option>
            <el-option label="已取消" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrder(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from 'element-ui'
export default {
  name: "ordertable",
  created() {
    this.getOrderInfo()
  },
  data(){
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      multipleSelection: [],
      delList: [],
      pageTotal: 0,
      idx: -1,
      id: -1,
      show: false,
      tableData: [],
      dialogFormVisible: false,
      form: {
        orderId: '',
        orderUserName: '',
        orderUserTelephone: '',
        openId: '',
        startOfDate: '',
        endOfDate: '',
        orderStatus: '',
        orderPrice: '',
        hotelId: '',
        roomId: '',
        orderUserPs: '',
        orderRoomNumber: '',
      },
      selectData: []
    }
  },
  watch: {
    dialogFormVisible: function (val,oldVal){
      setTimeout(()=>{
        this.getOrderInfo()
      },100)
    }
  },
  methods: {
    mapForm(selectRow) {
      this.form = selectRow
    },
    getOrderInfo(){
      let adminId = this.$store.getters.getUserId;
      this.$request.get('admin/order/selectAllOrderByAdminId',{
        params: {
          adminId: adminId
        }
      }).then(res =>{
        this.tableData = res.data.data
        this.pageTotal = res.data.data.length || 50
      })
    },
    updateOperation(){
      this.mapForm(this.selectData[0])
      this.dialogFormVisible = true
    },
    updateOrder(data){
      this.$request({url: 'admin/order/updateOrder',method: "post", data: data}).then(res => {
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getOrderInfo()
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
          .catch(() => {});
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
    }
  }
}
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
</style>
