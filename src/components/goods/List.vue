<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>单车管理</el-breadcrumb-item>
            <el-breadcrumb-item>单车列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索框与按钮 -->
            <el-row :gutter="20"> 
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query"
                    clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search"
                        @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加单车</el-button>
                </el-col>
            </el-row>

            <!-- table表格区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="学院" prop="goods_price"
                width="180px"></el-table-column>
                <el-table-column label="所有者" prop="goods_name"
                width="160px"></el-table-column>
                <el-table-column label="学号" prop="goods_weight"
                width="160px"></el-table-column>
                <el-table-column label="登记上牌时间" prop="add_time"width="220px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope" >
                        <el-button type="primary" icon="el-icon-edit" 
                        size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                        size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return{
            // 查询参数对象
            queryInfo: {
                query:'',
                pagenum:1,
                pagesize: 5
            },
            // 单车列表
            goodslist:[],
            // 总数据条数
            total:0
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        // 根据分页获取对应的商品列表
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{
                params:this.queryInfo
            })
            if(res.meta.status!== 200){
                return this.$message.error('获取单车列表失败')
            }
            this.$message.success('获取单车列表成功')
            console.log(res.data)
            this.goodslist =res.data.goods
            this.total=res.data.total
        },
        // 监听页面大小变化
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getGoodsList()
        },
        // 监听页码变化 
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 删除数据
        async removeById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(err=>err)

        if(confirmResult!== 'confirm'){
            return this.$message.info('取消删除')
        }
        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200){
            return this.$message.error('删除数据失败')
        }
        this.$message.success('删除数据成功')
        this.getGoodsList()
        },
        // 跳转到  添加页面 add
        goAddpage(){
            this.$router.push('/goods/add')
        }


    }
}
</script>

<style lang="less" scoped>
</style>