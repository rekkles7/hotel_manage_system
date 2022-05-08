<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-message"></i> 评论管理
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
        <el-input v-model="query.name" placeholder="评论内容" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
<!--        <el-button type="success" icon="el-icon-plus" @click="updateOperation('post')">新增</el-button>-->
        <el-button type="danger" icon="el-icon-edit" @click="showReplyWindows">回复</el-button>
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
        <el-table-column prop="nickName" label="评论昵称"></el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <el-image
                class="table-td-thumb"
                :src="scope.row.avatarUrl"
                :preview-src-list="[scope.row.avatarUrl]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="commentContent" label="评论内容"></el-table-column>
        <el-table-column prop="roomName" label="房型名称"></el-table-column>
        <el-table-column prop="createTime" label="评论时间"></el-table-column>
        <el-table-column prop="replyContent" label="商家回复"></el-table-column>
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

    <el-dialog append-to-body title="回复评论" :visible.sync="dialogFormVisible" width="680px">
      <el-form :model="form" :inline="true" :rules="rules" size="small" label-width="80px" ref="reply">
        <el-form-item label="回复内容"  prop="replyContent">
          <el-input v-model="form.replyContent" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="replyComment(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Element from 'element-ui'
import store from "@/store"
export default {
  name: 'commenttable',
  data() {
    return {
      query: {
        address: '',
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      rules:{
        replyContent: [
          { required: true, message: '评论不能为空', trigger: "blur" },
        ],
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      dialogFormVisible: false,
      pageTotal: 0,
      idx: -1,
      id: -1,
      hotelId: '',
      roles: [],
      selectData: [],
      form: {
        commentId: '',
        replyContent: ''
      },
    };
  },
  created() {
    this.getHotelId()
  },
  methods: {
    getComments(){
      let hotelId = this.hotelId;
      console.log(hotelId)
      this.$request.get('admin/comments/selectCommentsByHotelId',{
        params: {
          hotelId: hotelId
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
        this.hotelId = res.data
        this.getComments()
      })
    },
    replyComment(data) {
      this.$refs.reply.validate(valid=>{
        if (valid){
          this.$request.get('admin/comments/replyComment',{
            params: {
              commentId: data.commentId,
              replyContent: data.replyContent
            }
          }).then(res =>{
            if (res.data.status == 200){
              Element.Message.success("回复成功")
              this.dialogFormVisible = false
            }else{
              Element.Message.error(res.data.msg)
            }
            this.getComments()
          })
        }else{
          Element.Message.error("评论不可为空")
        }
      })
    },
    showReplyWindows(){
      this.mapForm(this.selectData[0])
      this.dialogFormVisible = true;
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
