<template>
    <div>
         <!-- 面包屑导航区域 -->
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>车牌管理</el-breadcrumb-item>
            <el-breadcrumb-item>车牌列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索框区域 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                      </el-input>
                </el-col>
            </el-row>

            <!-- 车牌列表数据 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="车牌编号" prop="order_number"></el-table-column>
                <el-table-column label="所属学院" prop="order_price"></el-table-column>
                <el-table-column label="是否合格" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status==='1' ">合格</el-tag>
                        <el-tag type="danger" v-else>不合格</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否事故" prop="is_send"></el-table-column>
                <el-table-column label="登记时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                        @click="showBox"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location"
                        @click="showProgressBox"></el-button>
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
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog
        @close="addressDialogClosed"
        title="修改什么鬼东西"
        :visible.sync="adressVisible"
        width="50%">
            <el-form :model="addressForm" :rules="addressFormRules" 
            ref="addressFormRef" label-width="100px">
                <el-form-item label="数据1" prop="address1">
                    <el-cascader :options="cityData" 
                    v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="数据2" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="adressVisible = false">取 消</el-button>
            <el-button type="primary" @click="adressVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 展示定位的对话框 -->
        <el-dialog
        title="处理进度"
        :visible.sync="progressVisible"
        width="50%">
        <img src="../../assets/logo-n.png" width="300px" alt="">
        <span style="margin: 0 50px;">我啥都没做</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="progressVisible = false">确 定</el-button>
        </span>    
    </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'
export default{
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            orderList:[],
            adressVisible:false,
            addressForm:{
                address1:[],
                address2:''
            },
            addressFormRules:{
                address1:[{
                    required:true,message:'请选择数据1',
                    trigger:'blur'
                }],
                address2:[{
                    required:true,message:'请输入数据2',
                    trigger:'blur'
                }],
            },
            cityData,
            progressVisible:false,
            // 进度信息数组
            progressInfo:[]

        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
            const { data: res } = await this.$http.get(`orders`,{
                params:this.queryInfo
            })
            if(res.meta.status!==200){
                return this.$message.error('获取车牌列表失败')
            }
            console.log(res)
            this.total = res.data.total
            this.orderList = res.data.goods
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showBox(){
            this.adressVisible = true
        },
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox(){
            // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
            // // console.log(res)
            // if(res.meta.status!==200){
            //     return this.$message.error('获取进度信息失败')
            // }
            // this.progressInfo = res.data
            this.progressVisible = true
            // console.log(this.progressInfo)
            console.log('我啥都没做')
        }
    }
}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>