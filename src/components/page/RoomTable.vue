<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-read"></i> 房型管理
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
        <el-input v-model="query.name" placeholder="酒店名" class="handle-input mr10"></el-input>
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
        <el-table-column prop="roomName" label="房型名称"></el-table-column>
        <el-table-column label="房型图片" align="center">
          <template slot-scope="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.roomImgUrl"
                :preview-src-list="[scope.row.roomImgUrl]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="roomPrice" label="房型价格"></el-table-column>
        <el-table-column prop="roomService" label="房型服务"></el-table-column>
        <el-table-column prop="roomNumber" label="房型数量"></el-table-column>
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

    <!-- 编辑弹出框 -->
    <!--        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">-->
    <!--            <el-form ref="form" :model="form" label-width="70px">-->
    <!--                <el-form-item label="用户名">-->
    <!--                    <el-input v-model="form.name"></el-input>-->
    <!--                </el-form-item>-->
    <!--                <el-form-item label="地址">-->
    <!--                    <el-input v-model="form.address"></el-input>-->
    <!--                </el-form-item>-->
    <!--            </el-form>-->
    <!--            <span slot="footer" class="dialog-footer">-->
    <!--                <el-button @click="editVisible = false">取 消</el-button>-->
    <!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
    <!--            </span>-->
    <!--        </el-dialog>-->
    <el-dialog append-to-body title="房型信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="80px">
        <el-form-item label="房型名称">
          <el-input v-model="form.roomName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房型价格">
          <el-input v-model="form.roomPrice" autocomplete="off" style="width: 500px"></el-input>
        </el-form-item>
        <el-form>
          <el-form-item label="房型图片">
            <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :http-request="upload"
                multiple=""
                :auto-upload="true"
            >
              <img v-if="isUpload === true" :src="form.roomImgUrl" style="width: 100%;height: 100%;"/>
              <i v-if="isUpload === false" class="el-icon-upload"></i>
              <div v-if="isUpload === false" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-form-item label="房型数量">
          <el-input v-model="form.roomNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="房型服务">
          <el-input v-model="form.roomService" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoom(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from 'element-ui'
import store from "@/store"
export default {
  name: 'roomtable',
  data() {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      isUpload: false,
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
        roomId: '',
        roomName: '',
        roomPrice: '',
        roomNumber: '',
        roomImgUrl: '',
        roomService: '',
        hotelId: ''
      },
    };
  },
  created() {
    this.getRoomInfo()
    this.getHotelId()
  },
  methods: {
    getRoomInfo(){
      let adminId = this.$store.getters.getUserId;
      this.$request.get('admin/room/selectAllRoom',{
        params: {
          adminId: adminId
        }
      }).then(res =>{
        this.tableData = res.data.data
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
        console.log(this.form.hotelId);
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    //通过onchanne触发方法获得文件列表
    handleChange(file, fileList) {
      this.fileList = fileList;
      console.log(fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    upload(file) {
      let fd = new FormData();

      //文件信息中raw才是真的文件
      fd.append("files", file.file);
      console.log(fd);

      this.$request.post(`/admin/room/upload`, fd).then((res) => {
        this.isUpload = true;
        this.form.roomImgUrl = res.data;
      });
    },
    updateRoom(data) {
      let op = this.$store.state.operation
      console.log("提交给后端/admin/room接口的数据", data)
      console.log(op)
      this.$request({url: 'admin/room', method: op, data: data}).then(res => {
        console.log(op + '房型成功')
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getRoomInfo()
      })
    },
    updateOperation(op){
      if (op === 'put'){
        this.mapForm(this.selectData[0])
      }
      this.$store.commit('SET_OP', op)
      console.log(this.form)
      this.dialogFormVisible = op !== 'delete'
      if (op !== 'delete') this.getRole()
      else{
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
            .then(() => {
              this.updateRoom(this.selectData.map(value => value.roomId))
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
