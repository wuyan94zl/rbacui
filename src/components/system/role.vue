<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="roleVisible=true;">添加角色</el-button>
            </div>
            <el-table :data="roles" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="remark" label="角色说明"></el-table-column>
                <el-table-column label="操作" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="rolePermissionVisible=true;menuPermission(scope.row.id);">菜单权限管理</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="roleVisible=true;roleForm=scope.row">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :current-page="cur_page" :total="total" :page-size="pageSize"></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="角色管理" :visible.sync="roleVisible" width="30%">
            <el-form ref="form" :model="roleForm" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色说明">
                    <el-input v-model="roleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleAction">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="角色权限管理" :visible.sync="rolePermissionVisible" width="30%">
            <el-tree :data="rolePermissionFrom" show-checkbox default-expand-all node-key="id" :default-checked-keys="hasPermissionFrom" ref="tree" highlight-current :props="defaultProps" >
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rolePermissionVisible = false">取 消</el-button>
                <el-button type="primary" @click="rolePermissionAction">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'basetable',
    data() {
        return {
            roleVisible: false,
            roleForm: {},
            roles: [],
            total: 0,
            pageSize: 0,
            cur_page: 1,
            rolePermissionVisible: false,
            rolePermissionFrom: {},
            hasPermissionFrom: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            role_id: 0,
        };
    },
    created() {
        this.getRoles();
    },
    methods: {
        // 分页导航
        handleCurrentChange(val) {
            this.cur_page = val
            this.getRoles()
        },
        getRoles() {
            this.$axios.get('eachdemo/rbac/roles?page=' + this.cur_page, {})
                .then(response => {
                    let data = response.data
                    this.roles = data.data
                    this.total = data.total
                    this.pageSize = data.per_page
                    this.cur_page = data.current_page
                });
        },
        roleAction() {
            if (this.roleForm.id) {
                this.$axios.post('eachdemo/rbac/role/edit/' + this.roleForm.id, this.roleForm)
                    .then(response => {
                        let select = response.data
                        this.roles = response.data
                        this.$message.success('更新成功');
                        this.roleVisible = false;
                        this.getRoles()
                    });
            } else {
                this.$axios.post('eachdemo/rbac/role/create', this.roleForm)
                    .then(response => {
                        let select = response.data
                        this.roles = response.data
                        this.$message.success('添加成功');
                        this.roleVisible = false;
                        this.getRoles()
                    });
            }
        },
        roleDel() {

        },

        menuPermission(id) {
            this.role_id = id
            this.$axios.get('eachdemo/rbac/role/' + id + '/menus/permissions', {})
                .then(response => {
                    let data = response.data
                    this.rolePermissionFrom = data.tree_data
                    this.hasPermissionFrom = data.tree_has
                });
        },
        rolePermissionAction() {
            console.log(this.$refs.tree.getCheckedNodes());
            // console.log(this.$refs.tree.getCheckedKeys());
            let allSelected = this.$refs.tree.getCheckedNodes();
            let permissions = [];
            for (let item in allSelected) {
                if (allSelected[item].type == 'permission') {
                    permissions.push(allSelected[item].id);
                }
            }
            console.log(permissions)
            this.$axios.post('eachdemo/rbac/role/' + this.role_id + '/menus/permissions', { 'permissions': permissions })
                .then(response => {
                    let data = response.data
                    this.$message.success('设置成功');
                    this.rolePermissionVisible = false
                });
        },

        // 删除操作
        handleDelete(id) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    this.$axios.get('eachdemo/rbac/role/delete/' + id, {})
                        .then(response => {
                            this.$message.success('删除成功');
                        });
                })
                .catch(() => {});
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
            this.getData();
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
</style>