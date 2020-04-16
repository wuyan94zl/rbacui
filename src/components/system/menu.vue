<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单权限
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" class="handle-del mr10" @click="menuVisible=true">创建菜单</el-button>
                <el-button type="primary" icon="el-icon-lx-add" class="handle-del mr10" @click="route()">生成路由权限</el-button>
            </div>
            <el-table :data="treeMenu" style="width: 100%;margin-bottom: 30px;" border row-key="id" :default-expand-all="true">
                <el-table-column prop="name" width="300px" label="菜单名称">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-lx-add" @click="menuVisible=true;menuForm.parentName=scope.row.name;menuForm.pid=scope.row.id">
                        </el-button>&nbsp&nbsp{{scope.row.name}}
                        <span v-if="scope.row.display == 1" style="color: blue">（显示）</span>
                        <span v-else style="color: red">（隐藏）</span>
                        <span style="float: right;">
                            <el-button v-if="!scope.row.children" type="text" icon="el-icon-lx-add" @click="permissionVisible=true;permissionMenu=scope.row.name;permissionForm.menu_id=scope.row.id">权限</el-button>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="route" width="200px" label="菜单路由"></el-table-column>
                
                <el-table-column prop="name" label="菜单权限">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.permissions" style="margin-left: 10px;">
                            <el-row style="margin-left: 10px;">
                                <el-col :span="8">{{index+1}}：{{item.name}}</el-col>
                                <el-col :span="14">{{item.action}}</el-col>
                                <el-col :span="2">
                                    <el-button type="text" icon="el-icon-edit" @click="permissionVisible=true;permissionForm=item"></el-button>
                                    <el-button type="text" icon="el-icon-delete" class="red" @click="permissionDel(item.id,item.name)"></el-button>
                                </el-col>
                            </el-row>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="menuVisible=true;menuForm=scope.row">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="menuDel(scope.row.id,scope.row.name)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 创建菜单 -->
        <el-dialog title="菜单管理" :visible.sync="menuVisible" width="30%" :before-close="handleClose">
            <el-form ref="form" :model="menuForm" label-width="70px">
                <el-form-item label="上级菜单">
                    <el-select v-model="menuForm.pid" filterable placeholder="请选择">
                        <el-option key="顶级菜单" label="顶级菜单" value="0">
                        </el-option>
                        <el-option v-for="item in selectMenu" :key="item.name" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单名称">
                    <el-input v-model="menuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单路由">
                    <el-input v-model="menuForm.route"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                        <el-button @click="iconVisible = true">选择图标</el-button>
                        <el-input v-model="menuForm.icon" style="display:none"></el-input>
                        <span style="width:20px;height:20px;margin-left:10px;"><i :class="this.menuForm.icon" style="width:20px;height:20px;" ></i></span>
                    </el-form-item>
                <el-form-item label="菜单显示">
                    
                        <el-radio v-model="menuForm.display" :label="1">显示</el-radio>
                        <el-radio v-model="menuForm.display" :label="0">隐藏</el-radio>
                    
                    
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveMenu">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建权限 -->
        <el-dialog title="权限管理" :visible.sync="permissionVisible" width="30%" :before-close="handleClose">
            <el-form ref="form" :model="permissionForm" label-width="80px">
                <el-form-item label="所属菜单">
                    <el-select v-model="permissionForm.menu_id" filterable placeholder="请选择">
                        <el-option key="顶级菜单" label="顶级菜单" value="0">
                        </el-option>
                        <el-option v-for="item in selectMenu" :key="item.name" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限名称">
                    <el-input v-model="permissionForm.name"></el-input>
                </el-form-item>
                <el-form-item label="权限action">
                    <el-input v-model="permissionForm.action"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="savePermission">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="图标" :visible.sync="iconVisible" width="60%">
            <div>
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item><i class="el-icon-lx-emoji"></i> 自定义图标</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="container">
                    <div class="search-box">
                        <el-input class="search" size="large" v-model="keyword" clearable placeholder="请输入图标名称"></el-input>
                    </div>
                    <ul>
                        <li class="icon-li" v-for="(item,index) in list" :key="index">
                            <div class="icon-li-content" @click="selectIcon(item)">
                                <i :class="`el-icon-lx-${item}`"></i>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'basetable',
    data() {
        return {
            form: {},
            treeMenu: [],
            menuVisible: false,
            menuForm: {},
            permissionVisible: false,
            permissionForm: {},
            permissionMenu: '',
            selectMenu: [],
            keyword: '',
            iconList: [
                    'attentionforbid',
                    'attentionforbidfill',
                    'attention',
                    'attentionfill',
                    'tag',
                    'tagfill',
                    'people',
                    'peoplefill',
                    'notice',
                    'noticefill',
                    'mobile',
                    'mobilefill',
                    'voice',
                    'voicefill',
                    'unlock',
                    'lock',
                    'home',
                    'homefill',
                    'delete',
                    'deletefill',
                    'notification',
                    'notificationfill',
                    'notificationforbidfill',
                    'like',
                    'likefill',
                    'comment',
                    'commentfill',
                    'camera',
                    'camerafill',
                    'warn',
                    'warnfill',
                    'time',
                    'timefill',
                    'location',
                    'locationfill',
                    'favor',
                    'favorfill',
                    'skin',
                    'skinfill',
                    'news',
                    'newsfill',
                    'record',
                    'recordfill',
                    'emoji',
                    'emojifill',
                    'message',
                    'messagefill',
                    'goods',
                    'goodsfill',
                    'crown',
                    'crownfill',
                    'move',
                    'add',
                    'hot',
                    'hotfill',
                    'service',
                    'servicefill',
                    'present',
                    'presentfill',
                    'pic',
                    'picfill',
                    'rank',
                    'rankfill',
                    'male',
                    'female',
                    'down',
                    'top',
                    'recharge',
                    'rechargefill',
                    'forward',
                    'forwardfill',
                    'info',
                    'infofill',
                    'redpacket',
                    'redpacket_fill',
                    'roundadd',
                    'roundaddfill',
                    'friendadd',
                    'friendaddfill',
                    'cart',
                    'cartfill',
                    'more',
                    'moreandroid',
                    'back',
                    'right',
                    'shop',
                    'shopfill',
                    'question',
                    'questionfill',
                    'roundclose',
                    'roundclosefill',
                    'roundcheck',
                    'roundcheckfill',
                    'global',
                    'mail',
                    'punch',
                    'exit',
                    'upload',
                    'read',
                    'file',
                    'link',
                    'full',
                    'group',
                    'friend',
                    'profile',
                    'addressbook',
                    'calendar',
                    'text',
                    'copy',
                    'share',
                    'wifi',
                    'vipcard',
                    'weibo',
                    'remind',
                    'refresh',
                    'filter',
                    'settings',
                    'scan',
                    'qrcode',
                    'cascades',
                    'apps',
                    'sort',
                    'searchlist',
                    'search',
                    'edit'
                ],
            iconVisible:false,
        };
    },
    created() {
        this.getSelect();
        this.getMenu();
    },
    computed: {
            list(){
                return this.iconList.filter((item) => {
                    return item.indexOf(this.keyword) !== -1;
                })
            }
        },
    methods: {
        selectIcon(icon){
            this.menuForm.icon = 'el-icon-lx-'+icon;
            this.iconVisible = false;
        },
        getSelect() {
            this.$axios.get('eachdemo/rbac/menus/select', {})
                .then(response => {
                    let select = response.data
                    this.selectMenu = response.data
                });
        },
        getMenu() {
            this.$axios.get('eachdemo/rbac/menus', {})
                .then(response => {
                    this.treeMenu = response.data
                });
        },
        saveMenu() {
            if (this.menuForm.id) {
                this.$axios.post('eachdemo/rbac/menu/edit/' + this.menuForm.id, this.menuForm)
                    .then(response => {
                        this.$message.success(`菜单更新成功`);
                        this.getMenu()
                        this.handleClose()
                    });
            } else {
                this.$axios.post('eachdemo/rbac/menu/create', this.menuForm)
                    .then(response => {
                        this.$message.success(`菜单添加成功`);
                        this.getMenu()
                        this.getSelect();
                        this.handleClose()
                    });
            }

        },
        savePermission() {
            if (this.permissionForm.id) {
                this.$axios.post('eachdemo/rbac/permission/edit/' + this.permissionForm.id, this.permissionForm)
                    .then(response => {
                        this.$message.success(`权限添加成功`);
                        this.getMenu()
                        this.handleClose()
                    });
            } else {
                this.$axios.post('eachdemo/rbac/permission/create', this.permissionForm)
                    .then(response => {
                        this.$message.success(`权限更新成功`);
                        this.getMenu()
                        this.handleClose()
                    });
            }
        },
        menuDel(id, name) {
            // 二次确认删除
            this.$confirm('确定要删除`' + name + '`菜单吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$axios.get('eachdemo/rbac/menu/delete/' + id, {})
                    .then(response => {
                        this.$message.success('删除成功');
                        this.getMenu()
                    });
            }).catch(() => {});

        },
        permissionDel(id, name) {
            // 二次确认删除
            this.$confirm('确定要删除`' + name + '`权限吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$axios.get('eachdemo/rbac/permission/delete/' + id, {})
                    .then(response => {
                        this.$message.success('删除成功');
                        this.getMenu()
                    });
            }).catch(() => {});

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
        route(){
            this.$axios.get('eachdemo/rbac/permission/generate', {})
                .then(response => {
                    this.$message.success('生成成功');
                    this.getMenu()
                });
        },
        // 关闭编辑
        handleClose() {
            this.menuVisible = false
            this.permissionVisible = false

            this.menuForm = {}
            this.permissionForm = {}
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
.icon-li{
        display: inline-block;
        padding: 20px;
        width: 5px;
        height: 5px;
    }
    .icon-li-content{
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .icon-li-content i{
        font-size: 24px;
        color: #606266;
    }
    .icon-li-content span{
        margin-top: 10px;
        color: #787878;
    }
    .el-input--small{
    width: 70%!important;
    }
</style>