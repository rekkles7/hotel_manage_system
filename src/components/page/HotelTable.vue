<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-shop"></i> 酒店管理
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
        <el-table-column prop="hotelName" label="酒店名称"></el-table-column>
        <el-table-column prop="hotelDescription" label="酒店介绍"></el-table-column>
<!--        酒店图片-->
        <el-table-column label="酒店图片" align="center">
          <template slot-scope="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.hotelImgUrl"
                :preview-src-list="[scope.row.hotelImgUrl]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="hotelAddress" label="酒店地址"></el-table-column>
        <el-table-column prop="hotelService" label="酒店服务"></el-table-column>
        <el-table-column prop="hotelScore" label="酒店评分"></el-table-column>
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
    <el-dialog append-to-body title="酒店信息" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" size="small" label-width="80px">
        <el-form-item label="酒店名称">
          <el-input v-model="form.hotelName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店介绍">
          <el-input v-model="form.hotelDescription" autocomplete="off" style="width: 500px"></el-input>
        </el-form-item>
        <el-form>
          <el-form-item label="酒店图片">
            <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :http-request="upload"
                multiple=""
                :auto-upload="true"
            >
              <img v-if="isUpload === true" :src="form.hotelImgUrl" style="width: 100%;height: 100%;"/>
              <i v-if="isUpload === false" class="el-icon-upload"></i>
              <div v-if="isUpload === false" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-form-item label="酒店地址">
          <el-input v-model="form.hotelAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="酒店服务">
          <el-input v-model="form.hotelService" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateHotel(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from 'element-ui'
import store from "@/store"
export default {
  name: 'hoteltable',
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
      roleDatas: [],
      form: {
        hotelId: '',
        hotelName: '',
        hotelDescription: '',
        hotelAddress: '',
        hotelImgUrl: "",
        hotelService: '',
      },
    };
  },
  created() {
    this.getHotelInfo()
  },
  methods: {
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

      this.$request.post(`/admin/hotel/upload`, fd).then((res) => {
        this.isUpload = true;
        this.form.hotelImgUrl = res.data;
      });
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
              this.updateHotel(this.selectData.map(value => value.hotelId))
              this.$message.success('删除成功');
            })
            .catch(() => {});
      }
    },
    updateHotel(data) {
      let op = this.$store.state.operation
      console.log("提交给后端/admin/hotel接口的数据", data)
      console.log(op)
      this.$request({url: 'admin/hotel', method: op, data: data}).then(res => {
        console.log(op + '酒店成功')
        Element.Message.success("操作成功")
        this.dialogFormVisible = false
        this.getHotelInfo()
      })
    },
    mapForm(selectRow) {
      this.form = selectRow
    },
    getHotelInfo(){
      this.$request.get('/user/hotel/selectAllHotel').then(res =>{
        this.tableData = res.data.data
        this.pageTotal = res.data.data.length || 50
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
