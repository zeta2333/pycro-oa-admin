<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input
                style="width: 100%"
                v-model="searchObj.roleName"
                placeholder="角色名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            :loading="loading"
            @click="fetchData()"
            :disabled="$hasBP('bnt.sysRole.list') === false"
            >搜 索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetData"
            :disabled="$hasBP('bnt.sysRole.list') === false"
            >重 置</el-button
          >
        </el-row>
      </el-form>
    </div>
    <br />
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button
        type="success"
        icon="el-icon-plus"
        size="mini"
        @click="add"
        :disabled="$hasBP('bnt.sysRole.add') === false"
        >添 加</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-delete"
        class="btn-add"
        size="mini"
        @click="batchRemove()"
        :disabled="$hasBP('bnt.sysRole.remove') === false"
        >批量删除</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%; margin-top: 10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (current - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="description" label="角色描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <!--width="160"-->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row.id)"
            :disabled="$hasBP('bnt.sysRole.update') === false"
            title="修改"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            
            title="删除"
          />
          <el-button
            type="warning"
            icon="el-icon-baseball"
            size="mini"
            @click="showAssignAuth(scope.row)"
            :disabled="$hasBP('bnt.sysRole.assignAuth') === false"
            title="分配权限"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="current"
      :total="total"
      :page-size="size"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />

    <!-- 弹出框 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="sysRole"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="sysRole.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
          icon="el-icon-refresh-right"
          >取 消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveOrUpdate()"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 导入api文件
import api from "@/api/system/sysRole";
export default {
  // 定义数据模型
  data() {
    return {
      list: [], // 角色列表
      current: 1, // 当前页
      size: 5, // 每页显示记录
      total: 0, // 总记录数
      searchObj: {}, // 条件查询对象
      multipleSelection: [], // 批量删除选中的记录列表

      selections: [], // 复选框的值
      dialogVisible: false, // 弹框是否可见
      sysRole: {}, // 疯转表单角色数据
      saveBtnDisabled: false,
    };
  },
  // 页面渲染前的操作
  created() {
    this.fetchData();
  },
  // 定义方法
  methods: {
    // 角色分配权限
    showAssignAuth(row) {
      this.$router.push(
        "/system/assignAuth?id=" + row.id + "&roleName=" + row.roleName
      );
    },
    // 重置查询表单
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },
    // 点击复选框
    handleSelectionChange(selection) {
      this.selections = selection;
      console.log(this.selections);
    },
    // 点击修改按钮
    edit(id) {
      // 显示弹框
      this.dialogVisible = true;
      // 数据回显
      this.fetchDataById(id);
    },
    fetchDataById(id) {
      api.getById(id).then((response) => {
        this.sysRole = response.data;
      });
    },
    // 点击添加按钮
    add() {
      // 将sysRole置为空
      this.sysRole = {};
      // 显示弹框
      this.dialogVisible = true;
    },
    // 添加或修改
    saveOrUpdate() {
      // 根基id判断
      if (!this.sysRole.id) {
        // 添加
        this.saveData();
      } else {
        // 修改
        this.updateData();
      }
    },
    // 添加
    saveData() {
      api.saveRole(this.sysRole).then((response) => {
        // 提示
        this.$message.success(response.message || "操作成功");
        // 关闭弹框
        this.dialogVisible = false;
        // 刷新页面
        this.fetchData(this.current);
      });
    },
    // 修改
    updateData() {
      api.updateById(this.sysRole).then((response) => {
        // 提示
        this.$message.success(response.message || "操作成功");
        // 关闭弹框
        this.dialogVisible = false;
        // 刷新页面
        this.fetchData(this.current);
      });
    },
    // 批量删除
    batchRemove() {
      if (this.selections.length == 0) {
        this.$message.warning("请选择要删除的记录！");
        return;
      }
      this.$confirm("此操作将永久删除所选记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 数组保存需要删除的id
          let idList = [];
          // 遍历加入
          this.selections.forEach((item) => {
            idList.push(item.id);
          });
          // 调用api
          return api.batchRemove(idList);
        })
        .then((response) => {
          // 刷新页面，重新获取分页
          this.fetchData(this.current);
          // 提示信息
          this.$message.success(response.message || "删除成功");
        });
    },
    // 获取数据分页展示
    fetchData(current = 1) {
      this.current = current;
      api
        .getPageList(this.current, this.size, this.searchObj)
        .then((response) => {
          this.list = response.data.records;
          this.total = response.data.total;
        });
    },
    // 根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          return api.removeById(id);
        })
        .then((response) => {
          // 刷新页面，重新获取分页
          this.fetchData(this.current);
          // 提示信息
          this.$message.success(response.message || "删除成功");
        });
    },
  },
};
</script>