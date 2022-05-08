<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-remind"></i> 入住信息
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
<!--        <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-delete"-->
<!--            class="handle-del mr10"-->
<!--            @click="updateOperation('delete')"-->
<!--        >批量删除</el-button>-->
        <el-input v-model="query.name" placeholder="入住人" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="success" icon="el-icon-plus" @click="updateOperation('post')">新增</el-button>
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
        <el-table-column prop="checkUsername" label="入住人"></el-table-column>
        <el-table-column prop="checkUserphone" label="电话"></el-table-column>
        <el-table-column prop="checkIdCard" label="身份证"></el-table-column>
        <el-table-column prop="checkRoomNo" label="房间号"></el-table-column>
        <el-table-column prop="orderId" label="订单号"></el-table-column>
        <el-table-column prop="startOfDate" label="入住日期"></el-table-column>
        <el-table-column prop="endOfDate" label="离店日期"></el-table-column>
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


    <el-dialog append-to-body title="入住信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" :rules="rules" size="small" ref="checkin" label-width="80px">
        <el-form-item label="入住人" prop="checkUsername">
          <el-input v-model="form.checkUsername" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="checkUserphone">
          <el-input v-model="form.checkUserphone" autocomplete="off" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="checkIdCard">
          <el-input v-model="form.checkIdCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="checkRoomNo">
          <el-input v-model="form.checkRoomNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCheckIn(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from 'element-ui'
import store from "@/store"
import {encrypt} from "@/utils/rsaEncrypt";
import Cookies from "js-cookie";
import Config from "@/settings";
export default {
  name: 'checkintable',
  data() {
    var checkphone = (rule, value, callback) => {
      console.log("phone"+value)
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!this.isCellPhone(value)) { // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    };
    var isCardId = (rule, value, callback) => {
      console.log("idcard"+value)
      if (!value) {
        return new callback(new Error('身份证号不能为空'));
      } else {
        const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;
        const card = reg.test(value);
        if (!card) {
          //判断座机为12位
          callback(new Error("身份证格式如:423024xxxx0216xxxx"));
        } else {
          callback();
        }
      }
    };
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      } else {
        const reg = /^[\u4E00-\u9FA5]+$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('只能输入中文'));
        }
      }
    };
    var checkRoomNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('房间号不能为空'));
      } else {
        const reg = /^\d{3,}$/
        if (!reg.test(value)) {
          return callback(new Error('请输入3位以上的房间号'))
        }else{
          callback();
        }
      }
    };
    var checkOrderId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('订单号不能为空'));
      } else {
        const reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(value)) {
          return callback(new Error('订单号只能为数字'))
        }else{
          callback();
        }
      }
    };
    return {
      rules: {
        checkUserphone: [
          { required: true, validator: checkphone, trigger: "blur" },
        ],
        checkIdCard: [
          { required: true, validator: isCardId, trigger: "blur" },
        ],
        checkUsername: [
          { required: true, validator: checkUsername, trigger: "blur"},
        ],
        checkRoomNo: [
          { required: true, validator: checkRoomNo, trigger: "blur"},
        ],
        orderId: [
          { required: true, validator: checkOrderId, trigger: "blur"},
        ]
      },
      query: {
        address: '',
        name: '',
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
      selectData: [],
      form: {
        checkId: '',
        checkUsername: '',
        checkUserphone: '',
        checkIdCard: '',
        checkRoomNo: '',
        orderId: '',
        hotelId: ''
      },
    };
  },
  created() {
    this.getHotelId()
  },
  methods: {
    isCellPhone (val) {
      console.log(val)
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    getCheckIn(){
      this.$request.get('admin/checkin/selectCheckInByHotelId',{
        params: {
          hotelId: this.form.hotelId
        }
      }).then(res =>{
        this.tableData = res.data.data
        console.log(res.data)
        this.pageTotal = res.data.data.length || 50
      })
    },
    getHotelId(){
      let adminId = this.$store.getters.getUserId;
      this.$request.get('admin/room/selectHotelId',{
        params: {
          adminId: adminId
        }
      }).then(res =>{
        this.form.hotelId = res.data
        this.getCheckIn()
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    updateCheckIn(data) {
      this.$refs.checkin.validate(valid =>{
        if (valid){
          let op = this.$store.state.operation
          this.$request({url: 'admin/checkin', method: op, data: data}).then(res => {
            if (res.data.status == 200){
              Element.Message.success("操作成功")
              this.dialogFormVisible = false
            }else{
              Element.Message.error(res.data.msg)
            }
            this.getCheckIn()
          })
        }else{
          Element.Message.error("请完善入住信息")
        }
      })
    },
    updateOperation(op){
      if (op === 'put'){
        this.mapForm(this.selectData[0])
      }
      this.$store.commit('SET_OP', op)
      this.dialogFormVisible = op !== 'delete'
      if (op !== 'delete') this.getRole()
      else{
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
            .then(() => {
              this.updateCheckIn(this.selectData.map(value => value.checkId))
              this.$message.success('删除成功');
            })
            .catch(() => {});
      }
    },
    mapForm(selectRow) {
      this.form = selectRow
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
