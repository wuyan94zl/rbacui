<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 管理员列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="adminVisible=true;">添加用户</el-button>
            </div>
            <el-table :data="admin" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名" width="200"></el-table-column>
                <el-table-column prop="email" label="登录邮箱" width="240"></el-table-column>
                <el-table-column prop="email" label="所属角色">
                    <template scope="scope">
                        <el-button v-for="role in scope.row.roles" type="primary" round>{{role.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="editAction(scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="cur_page" :page-size="pageSize" :total="total" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="adminVisible" width="30%">
            <el-form ref="form" :model="adminForm" label-width="70px">
                <el-form-item label="用户名称">
                    <el-input v-model="adminForm.name"></el-input>
                </el-form-item>
                <el-form-item label="登录邮箱">
                    <el-input v-model="adminForm.email"></el-input>
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input v-model="adminForm.password"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-checkbox-group v-model="has" style="width:75%;">
                        <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adminVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdmin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'basetable',
    data() {
        return {
            adminVisible: false,
            adminForm: {},
            admin: [],
            total: 0,
            pageSize: 0,
            cur_page: 1,

            roles: [],
            has: [],
        };
    },
    created() {
        this.getData();
        this.getRoles();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            this.$axios.post('eachdemo/rbac/admin/lists?page=' + this.cur_page, {})
                .then(response => {
                    let data = response.data
                    this.admin = data.data
                    this.total = data.total
                    this.pageSize = data.per_page
                    this.cur_page = data.current_page
                });
        },
        // 获取 easy-mock 的模拟数据
        getRoles() {
            this.$axios.get('eachdemo/rbac/roles/all', {})
                .then(response => {
                    let data = response.data
                    this.roles = data
                    console.log(this.roles)
                });
        },
        editAction(row) {
            let roles = row.roles
            this.has = []
            for (var item in roles) {
                this.has.push(roles[item].id)
            }
            this.adminForm = row;
            this.adminVisible = true
        },
        // 保存编辑
        saveAdmin() {
            if (this.adminForm.id) {
                this.adminForm.has_role = this.has
                this.$axios.post('eachdemo/rbac/admin/update/' + this.adminForm.id, this.adminForm)
                    .then(response => {
                        this.adminVisible = false
                        this.adminForm = {}
                        this.getData()
                    });
            } else {
                this.adminForm.has_role = this.has
                this.$axios.post('eachdemo/rbac/admin/create', this.adminForm)
                    .then(response => {
                        this.adminVisible = false
                        this.adminForm = {}
                        this.getData()
                    });
            }
        },

        // 删除操作
        handleDelete(id) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    this.$axios.post('eachdemo/rbac/admin/delete/' + id, {})
                        .then(response => {
                            this.$message.success('删除成功');
                            this.getData()
                        });

                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
            this.adminVisible = true;
        },

        // 分页导航
        handlePageChange(val) {
            this.getData();
        },
        // 关闭编辑
        handleClose() {
            this.adminVisible = false
            this.adminForm = {}
            this.has = []
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