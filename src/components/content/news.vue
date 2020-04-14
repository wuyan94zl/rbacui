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
                <el-button type="primary" icon="el-icon-lx-add" @click="index(1)">index1</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="index(2)">index2</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="index(3)">index3</el-button>
                <el-button type="primary" icon="el-icon-lx-add" @click="index(4)">index4</el-button>
            </div>
            
        </div>
        
    </div>
</template>
<script>
export default {
    name: 'basetable',
    data() {
        return {
            
        };
    },
    created() {
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        index(num) {
            this.$axios.get('index' + num, {})
                .then(response => {
                    let data = response.data
                    console.log(data)
                });
        },
    }
};
</script>
<style scoped>

</style>